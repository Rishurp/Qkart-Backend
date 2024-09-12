# Setup file template to upload data to MongoDB Atlas
mongoimport --uri  --ssl --authenticationDatabase admin --username  --password  --drop --collection users --file data/export_qkart_users.json
mongoimport --uri  --ssl --authenticationDatabase admin --username  --password  --drop --collection products --file data/export_qkart_products.json