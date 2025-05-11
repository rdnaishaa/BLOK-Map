const catalogModel = require("../models/catalog.model");
const baseResponse = require("../utils/baseResponse.util");

const getCatalogs = async (req, res) => {
    const { kategori, rentangHarga } = req.query;

    try {
        let query = {};

        if (kategori) {
            query.kategori = kategori;
        }

        if (rentangHarga) {
            const [min, max] = rentangHarga.split('-').map(Number);
            query.harga = { min, max };
        }

        const catalogs = await catalogModel.getCatalogs(query);
        res.json(baseResponse(200, "Catalogs fetched successfully", catalogs));
    } catch (error) {
        res.status(500).json(baseResponse(500, "Error fetching catalogs", error));
    }
};

const getCatalogDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const catalog = await catalogModel.getCatalogById(id);

        if (!catalog) {
            return res.status(404).json(baseResponse(404, "Catalog not found"));
        }

        res.json(baseResponse(200, "Catalog detail fetched successfully", catalog));
    } catch (error) {
        res.status(500).json(baseResponse(500, "Error fetching catalog detail", error));
    }
};

const updateCatalog = async (req, res) => {
    const { id } = req.params;
    const catalogData = req.body;

    try {
        const updatedCatalog = await catalogModel.updateCatalog(id, catalogData);

        if (!updatedCatalog) {
            return res.status(404).json(baseResponse(404, "Catalog not found"));
        }

        res.json(baseResponse(200, "Catalog updated successfully", updatedCatalog));
    } catch (error) {
        res.status(500).json(baseResponse(500, "Error updating catalog", error));
    }
};

const deleteCatalog = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCatalog = await catalogModel.deleteCatalog(id);

        if (!deletedCatalog) {
            return res.status(404).json(baseResponse(404, "Catalog not found"));
        }

        res.json(baseResponse(200, "Catalog deleted successfully", deletedCatalog));
    } catch (error) {
        res.status(500).json(baseResponse(500, "Error deleting catalog", error));
    }
};

module.exports = {
    getCatalogs,
    getCatalogDetail,
    updateCatalog,
    deleteCatalog
};
