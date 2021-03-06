import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Skeleton, Upload } from 'antd';
import { useUsersContext } from 'context/userContext';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import customAxios from 'services/ApiClient';
import { EmployeeProps } from 'types/EmployeeInterface';
import { openNotification } from 'utils/openNotification';
import styles from './styles.module.scss';

const EmployeeDetailContainer = () => {
  const { Option } = Select;
  const listRoles = ['ADMIN', 'EMPLOYEE'];

  const navigate = useNavigate();
  const context = useUsersContext();

  const [isEditPage, setIsEditPage] = useState(true);

  const param = useParams();
  const initEmployee: EmployeeProps = {
    avatar: '',
    id: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
  };
  const [employee, setEmployee] = useState(initEmployee);

  const [loadingInfo, setLoadingInfo] = useState(false);

  useEffect(() => {
    setLoadingInfo(true);
    customAxios
      .get(`${process.env.REACT_APP_API_URL}/employees/${param.id}`)
      .then((res) => {
        // console.log('get info', res.data);
        setEmployee(res.data);
        setLoadingInfo(false);
      })
      .catch((err) => {
        // console.log(err);
        setLoadingInfo(false);
      });
  }, [param]);

  const handleEdit = () => {
    context.setIsDetailEmployee(false);
    setIsEditPage(false);
  };

  const handleBack = () => {
    isEditPage ? navigate(-1) : context.setIsDetailEmployee(true);
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
    // navigate(-1);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onChangeInput = (e: any) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    // console.log('submit: ', employee);
    customAxios
      .put(
        `${process.env.REACT_APP_API_URL}/employees/${employee.id}`,
        employee
      )
      .then((res) => {
        // console.log(res);
        openNotification('success', 'S???a th??ng tin th??nh c??ng!');
        navigate('/employees');
      })
      .catch((err) => {
        // console.log(err);
        openNotification(
          'error',
          'S???a th??ng tin kh??ng th??nh c??ng!',
          'Ki???m tra l???i c??c tr?????ng th??ng tin.'
        );
      });
  };

  // X??A
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(
    'B???n c?? ch???c mu???n x??a nh??n vi??n n??y?'
  );

  const handleDelete = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setModalText('??ang x??a nh??n vi??n...');
    setConfirmLoading(true);

    customAxios
      .delete(`${process.env.REACT_APP_API_URL}/employees/${employee.id}`)
      .then((res) => {
        setVisible(false);
        setConfirmLoading(false);
        openNotification('success', 'X??a th??nh c??ng');
        navigate('/employees');
      })
      .catch((err) => {
        openNotification('error', 'X??a th???t b???i');
      });
  };

  const handleCancel = () => {
    // console.log('???? h???y h??nh ?????ng');
    setVisible(false);
  };

  const handleChange = (info: any) => {
    const formData = new FormData();
    formData.set('avatar', info.file.originFileObj);

    customAxios
      .post(`${process.env.REACT_APP_API_URL}/image/`, formData)
      .then((res) => {
        setEmployee({ ...employee, avatar: res.data });
      });
  };

  return (
    <div className={styles.UserDetail}>
      <div className={`${styles.center} ${styles.userHeader}`}>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          onChange={handleChange}
        >
          {employee.avatar === '' ? (
            <div>
              <UserOutlined />
            </div>
          ) : (
            <img src={employee.avatar} alt="avatar" style={{ width: '100%' }} />
          )}
        </Upload>
      </div>
      <div className={styles.userInfo}>
        {loadingInfo ? (
          <>
            <Skeleton active />
            <Skeleton active />
          </>
        ) : (
          <Form
            name="basic"
            initialValues={employee}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item>
              <div className={styles.userInfoItem}>
                <label>M?? nh??n vi??n</label>
                <Input
                  type="text"
                  defaultValue=""
                  readOnly
                  value={`NV${employee.id}`}
                />
              </div>
            </Form.Item>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Nh???p t??n nh??n vi??n',
                },
              ]}
            >
              <div className={styles.userInfoItem}>
                <label htmlFor="Name">T??n nh??n vi??n</label>
                <Input
                  name="name"
                  type="text"
                  id="Name"
                  placeholder={'Nh???p t??n nh??n vi??n'}
                  value={`${employee.name}`}
                  onChange={onChangeInput}
                />
              </div>
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Nh???p email',
                },
              ]}
            >
              <div className={styles.userInfoItem}>
                <label htmlFor="Email">Email</label>
                <Input
                  name="email"
                  type="text"
                  defaultValue=""
                  placeholder="Nh???p email"
                  value={`${employee.email}`}
                  onChange={onChangeInput}
                />
              </div>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Nh???p m???t kh???u',
                },
              ]}
            >
              <div className={styles.password}>
                <label htmlFor="password">M???t kh???u</label>
                <Input.Password
                  // type="password"
                  name="password"
                  defaultValue=""
                  placeholder="Nh???p m???t kh???u"
                  value={`${employee.password}`}
                  onChange={onChangeInput}
                />
              </div>
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                {
                  required: true,
                  message: 'Nh???p s??? ??i???n tho???i',
                },
              ]}
            >
              <div className={styles.userInfoItem}>
                <label htmlFor="phone">S??? ??i???n tho???i</label>
                <Input
                  type="text"
                  defaultValue=""
                  id="Password"
                  placeholder="Nh???p s??? ??i???n tho???i"
                  name="phone"
                  value={`${employee.phone}`}
                  onChange={onChangeInput}
                />
              </div>
            </Form.Item>

            <Form.Item
              name="role"
              rules={[
                {
                  // required: true,
                  // message: 'Ch???n role',
                },
              ]}
            >
              <div className={styles.userInfoItem}>
                <label className={styles.labelRole} htmlFor="role">
                  Role
                </label>
                <Select
                  placeholder="Ch???n role"
                  className={styles.select}
                  value={employee.role}
                  onSelect={(value: string) => {
                    setEmployee({ ...employee, role: value });
                  }}
                >
                  {listRoles.map((item: string) => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </div>
            </Form.Item>

            {context.isDetailEmployee ? (
              <div className={`${styles.center} ${styles.footer}`}>
                <Button onClick={handleDelete}>X??a</Button>
                <div className={styles.btnConfirm}>
                  <Button htmlType="button" onClick={handleEdit} type="primary">
                    S???a
                  </Button>
                </div>
              </div>
            ) : (
              <div className={`${styles.center} ${styles.footer}`}>
                <Button onClick={handleBack}>H???y</Button>
                <div className={styles.btnConfirm}>
                  <Form.Item>
                    <div>
                      <Button
                        type="primary"
                        htmlType="button"
                        onClick={onSubmit}
                      >
                        L??u
                      </Button>
                    </div>
                  </Form.Item>
                </div>
              </div>
            )}
          </Form>
        )}
      </div>
      <Button
        className={styles.btnBack}
        type="default"
        shape="round"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftOutlined />
      </Button>

      <Modal
        title="X??c nh???n x??a Nhi???m v???"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        cancelText="Kh??ng"
      >
        <p>{modalText}</p>
      </Modal>
    </div>
  );
};

export default EmployeeDetailContainer;
