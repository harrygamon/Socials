import cloudinary from 'cloudinary'

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: Buffer | string) {
  return new Promise<string>((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream({
      folder: 'social-posts',
      resource_type: 'image',
    }, (error, result) => {
      if (error || !result) return reject(error)
      resolve(result.secure_url)
    }).end(file as Buffer)
  })
}
