import { UploadOutlined } from '@ant-design/icons';
import { ProForm, ProFormItem, ProFormText, } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message, Upload } from 'antd';
import React, { useState } from 'react';
import useStyles from './index.style';
import { updateUserInfo } from '@/services/zhiwei/me';
import { flushSync } from 'react-dom';

const BaseView: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const currentUser = initialState?.currentUser;

  const [avatarUrl, setAvatarUrl] = useState<string>(currentUser?.avatar || '/images/default_avatar.png');

  const { styles } = useStyles();
  // 头像组件 方便以后独立，增加裁剪之类的功能
  const AvatarView = ({ avatar }: { avatar: string }) => (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <Upload
        showUploadList={false}
        name='file'
        action="/api/me/uploadAvatar"
        onChange={(info) => {
          if (info.file.status !== 'uploading') {
            message.info("正在上传头像...");
          }
          if (info.file.status === 'done') {
            const { response } = info.file;
            if (response.success) {
              message.success(`${info.file.name} 上传成功`);
              setAvatarUrl("/api/me/avatar/" + response.data);
            } else {
              message.error("上传失败！");
            }
          }
        }}>
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            更换头像
          </Button>
        </div>
      </Upload>
    </>
  );

  // const { data: currentUser, loading } = useRequest(() => {
  //   return userInfo();
  // });

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  const handleFinish = async (value: any) => {
    const formData = { ...value };
    formData.avatar = avatarUrl;
    updateUserInfo(formData).then(response => {
      const { success } = response;
      if (success) {
        message.success('更新基本信息成功');
        fetchUserInfo();
      } else {
        message.warning('更新失败：' + response.message);
      }
    });
  };

  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <ProForm
          layout="vertical"
          onFinish={handleFinish}
          submitter={{
            searchConfig: {
              submitText: '更新基本信息',
            },
            render: (_, dom) => dom[1],
          }}
          initialValues={currentUser}
          requiredMark={false}
        >
          <ProFormItem
            label="编号"
          >
            {currentUser?.code}
          </ProFormItem>
          <ProFormText
            width="md"
            name="name"
            label="姓名"
            rules={[
              {
                required: true,
                message: '请输入您的姓名!',
              },
            ]}
          />
          <ProFormText
            width="md"
            name="phone"
            label="手机"
            rules={[
              {
                required: false,
                message: '请输入您的手机!',
              },
            ]}
          />
          <ProFormText
            width="md"
            name="email"
            label="邮箱"
            rules={[
              {
                required: false,
                message: '请输入您的邮箱!',
              },
            ]}
          />
        </ProForm>
      </div>
      <div className={styles.right}>
        <AvatarView avatar={avatarUrl} />
      </div>
    </div>
  );
};
export default BaseView;
