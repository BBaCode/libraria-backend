import { getDatabase, ref, get } from "firebase/database";

const getAllUsers = async (req, res) => {
  try {
    const dbRef = ref(getDatabase());
    const snapshot = await get(dbRef, "users");

    if (snapshot.exists()) {
      const data = snapshot.val();
      res.json({ data });
    } else {
      console.log("No data available");
      res.json({ data: null }); // or handle the case when no data is available
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getAllUsers };
