import React, { useEffect, useState } from "react";
import { Upload, Button, message } from "antd";
import ImgCrop from "antd-img-crop";
import { UploadFile } from "antd/lib/upload/interface";
import { getToken, modifyUser } from "@/api/loginRequest";
import {
  dispatchLoginState,
  useSubScribeLoginState,
} from "@/state/hooks/useLoginCheck";

export function AvatarUploader() {
  const { value: user } = useSubScribeLoginState();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  useEffect(() => {
    if (fileList[0]?.response && user) {
      modifyUser({
        ...user,
        avatar: fileList[0].response.content,
      })
        .then(() => {
          dispatchLoginState((old) =>
            old
              ? {
                  ...old,
                  avatar: fileList[0].response.content,
                }
              : null
          );
        })
        .finally(() => {
          message.success(`Avatar upload success!`);
        });
    }
  }, [fileList]);
  return (
    <ImgCrop rotate>
      <Upload
        action="http://81.69.173.136:9000/user-service/oss/upload"
        headers={{ token: getToken() }}
        fileList={fileList}
        onChange={onChange}
        maxCount={1}
        itemRender={() => null}
      >
        <Button size="small">Upload Avatar</Button>
      </Upload>
    </ImgCrop>
  );
}
