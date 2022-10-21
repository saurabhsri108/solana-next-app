const PrismaClient = require('@prisma/client').PrismaClient;
const productData = require('./coffee-data.json');

const client = new PrismaClient();

const disconnectPrisma = () => {
    client.$disconnect();
};

const seedProductTable = async () => {
    const products = await client.product.createMany({
        data: [
            ...productData
        ]
    });
    // console.log("Product db data");
    // console.log(products);
    disconnectPrisma();
};

seedProductTable();

module.exports = {};