// import Step from '../etl/ETL.step.class';
// import {
//     DataSourceType,
//     DataSourceConfig,
//     MappingSchema,
//     runDataMappingPipeline
// } from '../index'
// import ETL from '../etl/ETL.class';
// import Stage from '../etl/ETL.stage.class';
// import { createExtractStep } from '../etl/ETLPipeline';
// import { createTransformStep } from '../etl/ETLPipeline';
// import { createLoadStep } from '../etl/ETLPipeline';

// // Example 1: Simple Data Mapping
// // Sample input data
// const inputData = {
//   users: [
//     {
//       userId: 1,
//       firstName: "John",
//       lastName: "Doe",
//       emailAddress: "john.doe@example.com",
//       userType: "premium",
//       createdAt: "2023-01-15T08:30:00Z"
//     },
//     {
//       userId: 2,
//       firstName: "Jane",
//       lastName: "Smith",
//       emailAddress: "jane.smith@example.com",
//       userType: "basic",
//       createdAt: "2023-02-20T14:45:00Z"
//     }
//   ]
// };

// // Define a mapping schema for user data transformation
// const userMappingSchema: MappingSchema = {
//   mappings: [
//     {
//       source: "users[*].userId",
//       target: "customers[*].id"
//     },
//     {
//       source: "users[*].firstName",
//       target: "customers[*].name.first"
//     },
//     {
//       source: "users[*].lastName",
//       target: "customers[*].name.last"
//     },
//     {
//       source: "users[*].emailAddress",
//       target: "customers[*].contact.email"
//     },
//     {
//       source: "users[*].userType",
//       target: "customers[*].subscription",
//       transform: (value: string) => value === "premium" ? "paid" : "free"
//     },
//     {
//       source: "users[*].createdAt",
//       target: "customers[*].joinedDate",
//       transform: (value: string | number | Date) => {
//         const date = new Date(value);
//         return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
//       }
//     }
//   ]
// };

// // Create and use the data mapper
// const mapper = DataMapper.create(userMappingSchema);
// const transformedData = mapper.transform(inputData);
// console.log(JSON.stringify(transformedData, null, 2));

// // Expected output:
// // {
// //   "customers": [
// //     {
// //       "id": 1,
// //       "name": {
// //         "first": "John",
// //         "last": "Doe"
// //       },
// //       "contact": {
// //         "email": "john.doe@example.com"
// //       },
// //       "subscription": "paid",
// //       "joinedDate": "2023-01-15"
// //     },
// //     {
// //       "id": 2,
// //       "name": {
// //         "first": "Jane",
// //         "last": "Smith"
// //       },
// //       "contact": {
// //         "email": "jane.smith@example.com"
// //       },
// //       "subscription": "free",
// //       "joinedDate": "2023-02-20"
// //     }
// //   ]
// // }


// // Example 2: Complete ETL Pipeline with Multiple Data Sources
// // Define data sources
// const dataSources: DataSourceConfig[] = [
//   {
//     sourceType: DataSourceType.JSON,
//     source: "https://api.example.com/users"
//   },
//   {
//     sourceType: DataSourceType.CSV,
//     source: "https://api.example.com/subscriptions.csv"
//   }
// ];

// // Define mapping schema for merging data from multiple sources
// const mergeMappingSchema: MappingSchema = {
//   mappings: [
//     // Map user data from first source
//     {
//       source: "[0].data.users[*].id",
//       target: "mergedData[*].userId"
//     },
//     {
//       source: "[0].data.users[*].username",
//       target: "mergedData[*].username"
//     },
//     {
//       source: "[0].data.users[*].email",
//       target: "mergedData[*].contact.email"
//     },
    
//     // Map subscription data from second source
//     // Assuming the subscription data has a user_id that matches the id from users
//     {
//       source: "[1].data[*].user_id",
//       target: "mergedData[?(@.userId == $value)].subscriptionId",
//       complexMapping: {
//         type: "valueMatch",
//         sourceValuePath: "[1].data[*].user_id",
//         targetArray: "mergedData",
//         matchProperty: "userId",
//         destinationProperty: "subscriptionId",
//         valueProperty: "[1].data[*].subscription_id"
//       }
//     },
//     {
//       source: "[1].data[*].plan",
//       target: "mergedData[?(@.userId == $matchValue)].subscription.plan",
//       complexMapping: {
//         type: "valueMatch",
//         sourceValuePath: "[1].data[*].user_id",
//         targetArray: "mergedData",
//         matchProperty: "userId",
//         destinationProperty: "subscription.plan",
//         valueProperty: "[1].data[*].plan"
//       }
//     },
//     {
//       source: "[1].data[*].status",
//       target: "mergedData[?(@.userId == $matchValue)].subscription.status",
//       complexMapping: {
//         type: "valueMatch",
//         sourceValuePath: "[1].data[*].user_id",
//         targetArray: "mergedData",
//         matchProperty: "userId",
//         destinationProperty: "subscription.status",
//         valueProperty: "[1].data[*].status"
//       }
//     }
//   ]
// };

// // Run the ETL pipeline
// async function runUserDataIntegration() {
//   try {
//     const result = await runDataMappingPipeline(
//       dataSources,
//       mergeMappingSchema,
//       "CRM Database",
//       "./output/merged_users.json"
//     );
    
//     console.log("ETL Pipeline completed successfully");
//     console.log(`Result: ${result}`);
//   } catch (error) {
//     console.error(`ETL Pipeline failed: ${error}`);
//   }
// }

// runUserDataIntegration();


// // Example 3: Creating a Custom ETL Pipeline with Individual Steps

// // Define data source
// const salesDataSource: DataSourceConfig[] = [
//   {
//     sourceType: DataSourceType.JSON,
//     source: "./data/sales_data.json"
//   }
// ];

// // Define a transform schema to normalize sales data
// const salesTransformSchema: MappingSchema = {
//   mappings: [
//     {
//       source: "[0].data.sales[*].saleId",
//       target: "normalizedSales[*].id"
//     },
//     {
//       source: "[0].data.sales[*].saleDate",
//       target: "normalizedSales[*].date",
//       transform: (value: string | number | Date) => new Date(value).toISOString().split('T')[0]
//     },
//     {
//       source: "[0].data.sales[*].customerInfo.customerId",
//       target: "normalizedSales[*].customerId"
//     },
//     {
//       source: "[0].data.sales[*].items[*].itemId",
//       target: "normalizedSales[*].items[*].id"
//     },
//     {
//       source: "[0].data.sales[*].items[*].quantity",
//       target: "normalizedSales[*].items[*].qty"
//     },
//     {
//       source: "[0].data.sales[*].items[*].unitPrice",
//       target: "normalizedSales[*].items[*].price"
//     },
//     {
//       // Calculate total for each item
//       source: "[0].data.sales[*].items[*]",
//       target: "normalizedSales[*].items[*].total",
//       transform: (item: { quantity: number; unitPrice: number; }) => item.quantity * item.unitPrice
//     },
//     {
//       // Calculate total for each sale
//       source: "[0].data.sales[*].items",
//       target: "normalizedSales[*].totalAmount",
//       transform: (items: any[]) => items.reduce((sum: number, item: { quantity: number; unitPrice: number; }) => sum + (item.quantity * item.unitPrice), 0)
//     }
//   ]
// };

// // Define a custom validation step
// function createValidationStep() {
//   const validateData = async ({ params, etlData }:any) => {
//     console.log("[Validate] Validating sales data...");
    
//     const normalizedSales = etlData.normalizedSales || [];
//     let validSales = 0;
//     let invalidSales = 0;
    
//     const validatedSales = normalizedSales.filter((sale: { id: any; date: any; customerId: any; items: string | any[]; totalAmount: any; }) => {
//       // Check if the sale has all required fields
//       const isValid = sale.id && 
//                       sale.date && 
//                       sale.customerId && 
//                       Array.isArray(sale.items) && 
//                       sale.items.length > 0 &&
//                       typeof sale.totalAmount === 'number';
                      
//       if (isValid) {
//         validSales++;
//       } else {
//         invalidSales++;
//       }
      
//       return isValid;
//     });
    
//     console.log(`[Validate] Found ${validSales} valid sales and ${invalidSales} invalid sales`);
    
//     return {
//       ...etlData,
//       normalizedSales: validatedSales,
//       validationSummary: {
//         total: validSales + invalidSales,
//         valid: validSales,
//         invalid: invalidSales
//       }
//     };
//   };
  
//   return new Step("Validate Sales Data", validateData, { type: "validation" });
// }

// // Build a custom ETL pipeline
// async function runSalesETLPipeline() {
//   // Create an ETL pipeline
//   const etlPipeline = new ETL();
  
//   // Create and add stages
//   const extractStage = new Stage("Extract Sales Data");
//   extractStage.addStep(createExtractStep(salesDataSource));
  
//   const transformStage = new Stage("Transform Sales Data");
//   transformStage.addStep(createTransformStep(salesTransformSchema));
  
//   const validateStage = new Stage("Validate Sales Data");
//   validateStage.addStep(createValidationStep());
  
//   const loadStage = new Stage("Load Sales Data");
//   loadStage.addStep(createLoadStep("Sales Database", "./output/normalized_sales.json"));
  
//   // Add all stages to the pipeline
//   etlPipeline.addStage(extractStage);
//   etlPipeline.addStage(transformStage);
//   etlPipeline.addStage(validateStage);
//   etlPipeline.addStage(loadStage);
  
//   // Run the pipeline
//   try {
//     const result = await etlPipeline.start();
//     console.log("Sales ETL Pipeline completed successfully");
//     return result;
//   } catch (error) {
//     console.error(`Sales ETL Pipeline failed: ${error}`);
//     throw error;
//   }
// }

// runSalesETLPipeline();


// // Example 4: Complex Mapping with Nested Arrays and Conditional Logic

// const productData = {
//   categories: [
//     {
//       categoryId: "cat-001",
//       name: "Electronics",
//       products: [
//         {
//           id: "prod-101",
//           name: "Smartphone",
//           price: 699.99,
//           inventory: 120,
//           features: ["5G", "12MP Camera", "128GB Storage"],
//           status: "active"
//         },
//         {
//           id: "prod-102",
//           name: "Laptop",
//           price: 1299.99,
//           inventory: 45,
//           features: ["16GB RAM", "512GB SSD", "Intel i7"],
//           status: "active"
//         }
//       ]
//     },
//     {
//       categoryId: "cat-002",
//       name: "Home Appliances",
//       products: [
//         {
//           id: "prod-201",
//           name: "Refrigerator",
//           price: 899.99,
//           inventory: 30,
//           features: ["Energy Efficient", "Smart Controls", "Ice Maker"],
//           status: "active"
//         },
//         {
//           id: "prod-202",
//           name: "Microwave Oven",
//           price: 149.99,
//           inventory: 0,
//           features: ["1000W", "Digital Controls"],
//           status: "out_of_stock"
//         }
//       ]
//     }
//   ]
// };

// // Complex mapping schema with nested arrays and conditional logic
// const productMappingSchema: MappingSchema = {
//   mappings: [
//     // Map category information
//     {
//       source: "categories[*].categoryId",
//       target: "catalog.categories[*].id"
//     },
//     {
//       source: "categories[*].name",
//       target: "catalog.categories[*].title"
//     },
    
//     // Map products, but flattened into a single array
//     {
//       source: "categories[*].products[*].id",
//       target: "catalog.products[*].productId"
//     },
//     {
//       source: "categories[*].products[*].name",
//       target: "catalog.products[*].title"
//     },
//     {
//       source: "categories[*].products[*].price",
//       target: "catalog.products[*].priceUsd",
//       transform: (price: number) => `$${price.toFixed(2)}`
//     },
    
//     // Add category information to each product
//     {
//       source: "categories[*].categoryId",
//       target: "catalog.products[*].categoryId",
//       complexMapping: {
//         type: "parentValue",
//         parentArrayPath: "categories",
//         childArrayPath: "categories[*].products",
//         parentValue: "categoryId",
//         targetPath: "catalog.products"
//       }
//     },
//     {
//       source: "categories[*].name",
//       target: "catalog.products[*].categoryName",
//       complexMapping: {
//         type: "parentValue",
//         parentArrayPath: "categories",
//         childArrayPath: "categories[*].products",
//         parentValue: "name",
//         targetPath: "catalog.products"
//       }
//     },
    
//     // Transform features array to a single string
//     {
//       source: "categories[*].products[*].features",
//       target: "catalog.products[*].featuresSummary",
//       transform: (features: any[]) => features.join(", ")
//     },
    
//     // Set availability flag based on inventory and status
//     {
//       source: "categories[*].products[*]",
//       target: "catalog.products[*].isAvailable",
//       transform: (product: { inventory: number; status: string; }) => {
//         return product.inventory > 0 && product.status === "active";
//       }
//     },
    
//     // Create separate arrays for available and unavailable products
//     {
//       source: "categories[*].products[*]",
//       target: "catalog.availableProducts[*]",
//       transform: (product: { inventory: number; status: string; }) => {
//         return product.inventory > 0 && product.status === "active" ? product : null;
//       },
//       filter: (product: null) => product !== null
//     },
//     {
//       source: "categories[*].products[*]",
//       target: "catalog.unavailableProducts[*]",
//       transform: (product: { inventory: number; status: string; }) => {
//         return product.inventory === 0 || product.status !== "active" ? product : null;
//       },
//       filter: (product: null) => product !== null
//     },
    
//     // Add summary statistics
//     {
//       source: "categories",
//       target: "catalog.summary.totalCategories",
//       transform: (categories: string | any[]) => categories.length
//     },
//     {
//       source: "categories[*].products",
//       target: "catalog.summary.totalProducts",
//       transform: (productsArrays: any[]) => {
//         let total = 0;
//         productsArrays.forEach((products: string | any[]) => {
//           total += products.length;
//         });
//         return total;
//       }
//     },
//     {
//       source: "categories[*].products[*].price",
//       target: "catalog.summary.averagePrice",
//       transform: (prices: any[]) => {
//         const sum = prices.reduce((acc: any, price: any) => acc + price, 0);
//         return (sum / prices.length).toFixed(2);
//       }
//     }
//   ]
// };

// // Create and use the data mapper
// const productMapper = DataMapper.create(productMappingSchema);
// const transformedProductData = productMapper.transform(productData);
// console.log(JSON.stringify(transformedProductData, null, 2));