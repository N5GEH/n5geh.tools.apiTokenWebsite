import React, { useEffect, useState, ChangeEvent } from "react";
import { Result, Button, Card, Popover } from "antd";
import "antd/dist/antd.css";
import { AiOutlineCopy } from "react-icons/ai";
import useInterval from "use-interval";
import { ResultStatusType } from "antd/lib/result";
//import { DateTime } from 'luxon';

//const isoTime = DateTime.now().setZone('Europe/Berlin').toISO()
const NODE_ENV = process.env.NODE_ENV;
interface UserInfo {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  expirationDate: string;
}

function redirectToAuth() {
  if (NODE_ENV === "development") {
    window.location.href = "http://localhost:4000/auth/login";
  } else {
    window.location.replace("/auth/login");
  }
}

export function AccessToken() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [timeUntilExpiration, setTimeUntilExpiration] = useState<number | null>(
    null
  );

  useInterval(() => {
    if (userInfo == null) return;
    setTimeUntilExpiration(
      (Date.parse(userInfo.expirationDate) - Date.now()) / 1000
    );
  }, 50);

  useEffect(() => {
    (async () => {
      const res = await fetch("/userinfo");

      if (res.status !== 200) {
        redirectToAuth();
        return;
      }
      const { token_type, access_token, expires_in, expiration_date } =
        await res.json();
      setUserInfo({
        accessToken: access_token,
        expiresIn: expires_in,
        tokenType: token_type,
        expirationDate: expiration_date,
      });
    })();
  }, []);

  let subTitle = "";
  let resultStatus: ResultStatusType = "warning";

  if (timeUntilExpiration == null) {
    subTitle = "";
  } else {
    const minutes = Math.floor(timeUntilExpiration / 60);
    const seconds = Math.floor(timeUntilExpiration % 60);
    if (minutes >= 0 && seconds >= 0) {
      subTitle =
        "Your Token expires in: " +
        minutes +
        " Minutes and " +
        seconds +
        " seconds.";
      resultStatus = "success";
    } else {
      subTitle = "Your Token has expired!";
    }
  }

  if (userInfo == null) {
    return (
      <Result
        status={resultStatus as "warning"}
        title="You are not authenticated."
      />
    );
  }

  //const subTitle = "Your Token expires in: " + Math.floor(timeUntilExpiration / 60) + " minutes " + timeUntilExpiration % 60 + " seconds.";//+ userInfo.tokenType + "/n" + userInfo.accessToken;
  return (
    <Card
      style={{ width: 600 }}
      bodyStyle={{
        boxShadow:
          " 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      }}
    >
      <Result
        status={resultStatus}
        title="Access Token successfully retrieved!"
        subTitle={subTitle}
        extra={[
          <Button
            type="primary"
            icon={<AiOutlineCopy />}
            shape="round"
            size="large"
            key="copy"
            onClick={() => navigator.clipboard.writeText(userInfo.accessToken)}
          >
            <> Copy to Clipboard</>
          </Button>,
          <Popover
            content={
              <div style={{ width: "600px", overflowWrap: "break-word" }}>
                {userInfo.accessToken}
              </div>
            }
            autoAdjustOverflow={true}
            title="Access Token"
            trigger="click"
          >
            <Button shape="round" key="view">
              View
            </Button>
          </Popover>,
          <Button shape="round" key="refresh" onClick={() => redirectToAuth()}>
            Refresh
          </Button>,
        ]}
      />
    </Card>
  );
}
