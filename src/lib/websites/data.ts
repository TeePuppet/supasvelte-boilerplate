import { supabase } from '$lib/supabase/client';

// Not tested
// export const createSchema = async (schemaName: string) => {
// 	try {
// 		const { data, error } = await supabase.rpc('create_schema', {
// 			schema_name: schemaName
// 		});

// 		if (error) {
// 			console.error('Error creating schema:', error);
// 		} else {
// 			console.log('Schema created successfully:', data);
// 		}
// 	} catch (err) {
// 		console.error('Error creating schema:', err);
// 	}
// };

export const getPosts = async () => {};
export const getWebsite = async () => {};
export const getConfig = async () => {};
export const getCategories = async () => {};

export const uploadFile = async (website: string, folder: string, fileName: string, file: any) => {
    console.log('website is', website)
    const isBucked = await checkForBucket(website);
    console.log('is bucket', isBucked)
	let bucket;
	if (isBucked) {
		bucket = website;
	} else {
        console.log('creating bucket')
		let data = await createBucket(website);
        console.log(data)
		bucket = website;
	}
    console.log('bucket', bucket)
	// try {
	// 	const filePath = `${folder}/${fileName}`;

	// 	// Upload the file
	// 	const { data, error } = await supabase.storage.from(website).upload(filePath, file);

	// 	if (error) {
	// 		throw error;
	// 	}
	// 	console.log('File uploaded successfully:', data.path);
	// 	return data;
	// } catch (error: any) {
	// 	console.error('Error uploading file:', error.message);
	// }
};

export const checkForBucket = async (website_repo: string) => {
    const { data: buckets, error } = await supabase.storage.listBuckets()
	if (error) {
		console.log('Error listing buckets:', error);
		return false;
	} else {
		const bucketExists = buckets.some((bucket) => bucket.name === website_repo);
		console.log('Bucket exists:', bucketExists);
		return bucketExists;
	}
};

export const createBucket = async (website: string) => {
    const { data, error } = await supabase.storage.createBucket(website);
    if (error) {
        throw error;
    }
    return data;
};

