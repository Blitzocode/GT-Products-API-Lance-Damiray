import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "GT Products API",
            version: "1.0.0",
            description: "API documentation for the GT Products API"
        },
    },
    apis: ["./src/routes/*.js", "./src/controllers/*.js"], // adjust if needed
});
