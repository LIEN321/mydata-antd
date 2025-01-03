import { changePassword } from '@/services/zhiwei/me';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { List, message } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const passwordStrength = [
  <></>,
  <span key="weak" className="weak">弱</span>,
  <span key="medium" className="medium">中</span>,
  <span key="strong" className="strong">强</span>,
  <span key="strong" className="strong">很强</span>,
  <span key="strong" className="strong">极强</span>,
];

const SecurityView: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  // 新建窗口常量
  const [changePasswordModalOpen, handleChangePasswordModalOpen] = useState<boolean>(false);
  const getData = () => [
    {
      title: '账户密码',
      description: (
        <>
          当前密码强度：
          {passwordStrength[currentUser?.passwordStrength || 1]}
        </>
      ),
      actions: [<a key="Modify" onClick={() => { handleChangePasswordModalOpen(true); }}>修改</a>],
    },
  ];

  const data = getData();

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
  return (
    <>
      <List<Unpacked<typeof data>>
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />

      {changePasswordModalOpen &&
        <ModalForm
          title="修改密码"
          open={changePasswordModalOpen}
          onOpenChange={handleChangePasswordModalOpen}
          width={600}
          onFinish={async (values) => {
            const { newPassword, confirmPassword } = values;
            if (newPassword !== confirmPassword) {
              message.warning("确认密码与新密码不一致");
              return;
            }
            changePassword(values as any).then(response => {
              const { success } = response;
              if (success === true) {
                message.success("修改密码成功");
                handleChangePasswordModalOpen(false);
                fetchUserInfo();
              } else {
                message.warning("修改密码失败");
              }
            });
          }}
        >
          <ProFormText.Password
            rules={[{ required: true, message: "请输入原密码" }]}
            name="oldPassword"
            label="原密码"
            placeholder="请输入原密码"
          />
          <ProFormText.Password
            rules={[{ required: true, message: "请输入新密码" }]}
            name="newPassword"
            label="新密码"
            placeholder="请输入新密码"
          />
          <ProFormText.Password
            rules={[{ required: true, message: "请输入确认密码" }]}
            name="confirmPassword"
            label="确认密码"
            placeholder="请输入确认密码"
          />
        </ModalForm>}
    </>
  );
};

export default SecurityView;
