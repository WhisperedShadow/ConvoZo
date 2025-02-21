import { getAllUsers, getUserData } from "../../components/datacollector";
import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState(null);
  const [streak, setStreak] = useState(null);
  const [rank, setRank] = useState(null);
  const [email, setEmail]=useState(null);

  useEffect(() => {
    const unsub = getUserData(setEmail, setName, setStreak, console.log);

    getAllUsers().then((data) => {
      setUsers(data);

      const userIndex = data.findIndex((user) => user.name === name);
      if (userIndex === -1) {
        setRank("100+");
      } else if (userIndex < 10) {
        setRank(userIndex + 1);
      } else if (userIndex < 100) {
        setRank("10+");
      } else {
        setRank("100+");
      }
    });

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [name, streak]);

  return (
    <section className={styles.dashboard}>
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Streak</th>
          </tr>
        </thead>

        <tbody>
          {users.slice(0, 10).map((user, index) => (
            <tr
              key={index}
              className={user.email === email ? styles.highlight : ""}
            >
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.streak}</td>
            </tr>
          ))}
          {name && (
            <tr className={styles.currentUser}>
              <td>{rank}</td>
              <td>{name}</td>
              <td>{streak}</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default Dashboard;
