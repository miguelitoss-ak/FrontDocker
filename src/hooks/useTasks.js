import { useEffect, useState } from "react";
import axios from "axios";
import { getErrorMessage } from "../services/api";
import { listTasks } from "../services/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('loading');
  const [loadError, setLoadError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);


  useEffect(() => {
    const controller = new AbortController();

    listTasks({ signal: controller.signal })
        .then((data) => {
            setTasks(data);
            setStatus('success');
        })
        .catch((error) => {
            if(axios.isCancel(error))
                return;
            setLoadError(getErrorMessage(error));
            setStatus('error');
        });

        return () => controller.abort();

  }, [reloadKey]);

  const reload = () => {
    setStatus('loading');
    setLoadError(null);
    setReloadKey((prevKey) => prevKey + 1);
  }
  return { tasks, status, loadError, reload };
}