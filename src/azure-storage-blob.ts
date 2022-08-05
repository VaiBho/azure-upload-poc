// <snippet_package>
import { InteractiveBrowserCredential } from "@azure/identity";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { NodeType } from "./Storage";

const containerName = `container-2`;
const sasToken = process.env.REACT_APP_STORAGESASTOKEN;
const storageAccountName = process.env.REACT_APP_STORAGERESOURCENAME;

const signInOptions = {
  clientId: 'b529b1f0-f252-482a-b660-be457e698c3c',
  tenantId: 'c5fc8aad-2f43-44be-b2fc-c7f65d740377'
}

const getBlobServiceClient = () => {
  return new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/`,
    new InteractiveBrowserCredential(signInOptions)
  );
}
// <snippet_isStorageConfigured>
// Feature flag - disable storage feature to app if not configured
export const isStorageConfigured = () => {
  return !storageAccountName || !sasToken ? false : true;
};

// return list of blobs in container to display
const getBlobsInContainer = async (containerClient: ContainerClient) => {
  const returnedBlobUrls: string[] = [];

  // get list of blobs in container
  // eslint-disable-next-line
  for await (const blob of containerClient.listBlobsFlat()) {
    // if image is public, just construct URL
    returnedBlobUrls.push(
      `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
    );
  }

  return returnedBlobUrls;
};
export const getBlobsListInContainer = async () => {
  const blobs: Array<string> = [];
  const folders: Array<string> = [];
  const containerClient = getContainerClient();
  // get list of blobs in container
  // eslint-disable-next-line
  for await (const blob of containerClient.listBlobsFlat()) {
    if(blob.name.indexOf('/') !== -1) {
      folders.push(blob.name)
    } else {
      blobs.push(blob.name);
    }
  }
  

  // return returnedBlobUrls;
};
function prepareList(path:string):NodeType {
  const i = path.indexOf('/');
  if(i === -1) {
    return {file: path, children: []};
  }

  return {file: path.substring(0, i), children: [
    prepareList(path.substring(i + 1))
  ]}
}

const createBlobInContainer = async (
  containerClient: ContainerClient,
  file: File
) => {
  const blobName = "Folder1/Folder2/"+file.name;
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(blobName);

  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  await blobClient.uploadData(file, options);
};
// </snippet_createBlobInContainer>

// <snippet_uploadFileToBlob>
const uploadFileToBlob = async (file: File | null, selectedContainerName: string): Promise<string[]> => {
  
  if (!file) return [];

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = getBlobServiceClient();

  const containerClient: ContainerClient =
    blobService.getContainerClient(selectedContainerName);
  
    await containerClient.createIfNotExists({
      access: "container",
    }).catch(e => {

    })

  // upload file
  await createBlobInContainer(containerClient, file);

  // get list of blobs in container
  return getBlobsInContainer(containerClient);
};

export const getContainerClient = (): ContainerClient => {
  const blobService = getBlobServiceClient();
  return blobService.getContainerClient(containerName);
};

export const getContainerList = async () => {
  const blobService = getBlobServiceClient();
  return blobService.listContainers();
};

export default uploadFileToBlob;
