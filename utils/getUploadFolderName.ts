export const getCloudinaryFolderName = () : string => {
    return process.env.NODE_ENV === 'production' ? 'production_setup': 'dev_setup'
}


