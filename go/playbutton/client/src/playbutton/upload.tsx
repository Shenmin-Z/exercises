import React, { FC, useState, useRef } from "react";
import axios from "axios";

export let Upload: FC = () => {
  let [imgFile, setImgFile] = useState<File>(null);
  let [newImg, setNewImg] = useState<string>(null);
  let inputRef = useRef<HTMLInputElement>();

  return (
    <div>
      <div>
        <label>Choose images to upload (PNG, JPG)</label>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={() => {
            let files = inputRef.current.files;
            if (files.length === 1) {
              setImgFile(files[0]);
            } else if (files.length === 0) {
              setImgFile(null);
            }
          }}
        />
      </div>
      <div>
        {imgFile ? (
          <div>
            {imgFile.name}, {imgFile.size}
          </div>
        ) : (
          <p>No files currently selected for upload</p>
        )}
      </div>
      <div>
        <button
          onClick={async () => {
            if (!imgFile) return;
            try {
              let res = await axios({
                method: "post",
                url: "/api/image/playbutton",
                data: imgFile
              });
              let { data } = res;
              setNewImg(data);
            } catch {}
          }}
        >
          Submit
        </button>
      </div>
      {newImg && (
        <div>
          <img src={`data:image/jpeg;base64,${newImg}`} alt="generated image" />
        </div>
      )}
    </div>
  );
};
