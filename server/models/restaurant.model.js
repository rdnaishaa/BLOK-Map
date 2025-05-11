const db = require("../config/pg.database");

exports.createArticle = async (article, image) => {
  try {
    let imageUrl = null;
    if (image) {
      const uploadResponse = await db.cloudinary.uploader.upload(image.path);
      imageUrl = uploadResponse.secure_url;
    }

    const res = await db.query(
      `INSERT INTO articles (
        title, content, rating, restaurant_id, image_url
      ) VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [
        article.title,
        article.content,
        article.rating,
        article.restaurant_id,
        imageUrl
      ]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
}

exports.getArticleById = async (id) => {
  try {
    const res = await db.query(
      "SELECT * FROM articles WHERE id = $1",
      [id]
    );

    if (res.rows.length === 0) return null;
    return res.rows[0];
  } catch (error) {
    console.error("Error getting article by id:", error);
    throw error;
  }
};

exports.updateArticle = async (id, articleData, image) => {
  try {
    let imageUrl = articleData.image_url;
    if (image) {
      const uploadResponse = await db.cloudinary.uploader.upload(image.path);
      imageUrl = uploadResponse.secure_url;
    }

    const res = await db.query(
      `UPDATE articles SET
        title = $1,
        content = $2,
        rating = $3,
        image_url = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *`,
      [
        articleData.title,
        articleData.content,
        articleData.rating,
        imageUrl,
        id
      ]
    );

    if (res.rows.length === 0) return null;
    return res.rows[0];
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
};

exports.deleteArticle = async (id) => {
  try {
    const res = await db.query(
      "DELETE FROM articles WHERE id = $1 RETURNING *",
      [id]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};