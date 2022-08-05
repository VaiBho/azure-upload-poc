import React, { useEffect, useState } from "react";
import "./App.css";
import uploadFileToBlob, {
  getBlobsListInContainer,
  getContainerList,
  isStorageConfigured,
} from "./azure-storage-blob";

const storageConfigured = isStorageConfigured();

function Storage() {
  const [blobList, setBlobList] = useState<NodeType>({file: '', children: []});
  const [fileSelected, setFileSelected] = useState(null);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));
  const [containerList, setContainerList] = useState<Array<string>>([]);
  const [selectedContainer, setSelectedContainer] = useState("");

  const handleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedContainer(e.target.value);
  };

  const DisplayImagesFromContainer = () => (
    <div>
      <h2>Container items</h2>
      {
        printNode(blobList)
      }
    </div>
  );

  const printNode = (item: NodeType) => {
    return (
      <ul>
        <li>{item.file}</li>
        {
          item.children.map((node, index) => {
            return printNode(node);
          })
        }
      </ul>
    )
  }
  const onFileChange = (event: any) => {
    // capture file into state
    setFileSelected(event.target.files[0]);
  };

  const onFileUpload = async () => {
    // prepare UI
    // setUploading(true);
    console.log(1);

    // *** UPLOAD TO AZURE STORAGE ***
    const blobsInContainer: string[] = await uploadFileToBlob(
      fileSelected,
      selectedContainer
    );
    console.log(2);

    // prepare UI for results
    // setBlobList(blobsInContainer);

    // reset state/form
    setFileSelected(null);
    // setUploading(false);
    setInputKey(Math.random().toString(36));
  };

  const DisplayForm = () => (
    <div>
      <select value={selectedContainer} onChange={handleSelection}>
        {containerList.map((container, key) => (
          <option key={key}>{container}</option>
        ))}
      </select>
      <input type="file" onChange={onFileChange} key={inputKey || ""} />
      <button type="submit" onClick={onFileUpload}>
        Upload!
      </button>
    </div>
  );

  useEffect(() => {
    // async function fetchContainerList() {
      // const cList = await getContainerList();
      // const containerList = [];
      // console.log(cList);
      // for await (const container of cList) {
      //   containerList.push(container.name);
      // }
      // return containerList;
    // }
    // fetchContainerList().then((res) => {
      // setContainerList(res);
      // setSelectedContainer(res[0]);
    // });

    async function fetchBlobs() {
      // const blobList = await getBlobsListInContainer();
      const blobList = await getBlobsListInContainer();
      
      
      // setBlobList({file: '', children: blobList});
    }
    fetchBlobs();
  }, []);

  return (
    <div className="App">
      {storageConfigured && DisplayForm()}
      {storageConfigured && DisplayImagesFromContainer()}
    </div>
  );
}

export default Storage;
// https://dev.to/425show/connecting-to-azure-blob-storage-from-react-using-azure-identity-16l0#the-code

export type NodeType = {
  file: string;
  children: NodeType[];
}