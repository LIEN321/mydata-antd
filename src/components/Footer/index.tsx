import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'mydata',
          title: 'MyData',
          href: 'https://www.mydata.work',
          blankTarget: true,
        },
        {
          key: 'gitee',
          title: 'Gitee',
          href: 'https://gitee.com/LIEN321',
          blankTarget: true,
        },
      ]}
      copyright={`2024 lient321 v0.9.1`}
    />
  );
};

export default Footer;
