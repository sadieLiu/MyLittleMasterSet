import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { db } from "../firebase.js";

const BAR_COLOR = "#7a3f89";
const GRID_COLOR = "#e5e4e7";
const LABEL_COLOR = "#32174d";

export default function TopFavoritesChart({ title, collectionName, resultLimit }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const topQuery = query(
      collection(db, collectionName),
      orderBy("favoritesCounter", "desc"),
      limit(resultLimit)
    );

    const unsubscribe = onSnapshot(
      topQuery,
      (snapshot) => {
        setData(
          snapshot.docs.map((docSnap) => ({
            name: docSnap.id,
            favoritesCounter: docSnap.data().favoritesCounter || 0
          }))
        );
        setLoading(false);
      },
      (snapshotError) => {
        console.error(`Unable to load top ${collectionName}.`, snapshotError);
        setError("Unable to load this chart right now.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, resultLimit]);

  const chartHeight = Math.max(120, data.length * 44);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="card-title h5">{title}</h2>

        {loading && <p className="mb-0">Loading...</p>}
        {error && <p className="alert alert-warning mb-0">{error}</p>}
        {!loading && !error && data.length === 0 && (
          <p className="text-muted mb-0">No favorites yet.</p>
        )}

        {!loading && !error && data.length > 0 && (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={data} layout="vertical" margin={{ top: 8, right: 32, bottom: 8, left: 8 }}>
              <CartesianGrid horizontal={false} stroke={GRID_COLOR} />
              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={{ stroke: GRID_COLOR }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                tickLine={false}
                axisLine={{ stroke: GRID_COLOR }}
              />
              <Tooltip cursor={{ fill: "rgba(122, 63, 137, 0.08)" }} />
              <Bar dataKey="favoritesCounter" fill={BAR_COLOR} barSize={20} radius={[0, 4, 4, 0]}>
                <LabelList dataKey="favoritesCounter" position="right" fill={LABEL_COLOR} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
