import { useState, useEffect } from "react";
import { getRoleplayData } from "../../components/datacollector";
import styles from "./Roleplay.module.css";

const Roleplay = () => {
  const [datas, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await getRoleplayData(setData);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Roleplay Scenarios</h2>
      {datas.length > 0 ? (
        <div className={styles.grid}>
          {datas.map((data, index) => (
            <div key={index} className={styles.card}>
              <img src={data.img} alt="Scenario" className={styles.image} />
              <h3 className={styles.role}>{data["User role"]} 🆚 {data["Ai role"]}</h3>
              <p className={styles.message}>{data["ScenarioMessage"]}</p>
              <a href={`/roleplay/${data.id}`} className={styles.link}>🔗Start</a>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.loading}>Loading...</p>
      )}
    </div>
  );
};

export default Roleplay;
