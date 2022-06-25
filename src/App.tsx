import { createClient } from "@supabase/supabase-js";
import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";

const supabase = createClient(
  import.meta.env.VITE_supabaseUrl,
  import.meta.env.VITE_supabaseKey
);

interface IClasses {
  id: string;
  created_at: string;
  title: string;
  released_at: string;
  description: string;
  has_resources: boolean;
}

const newId = () => window.crypto.randomUUID();

function App() {
  const [classes, setClasses] = useState<IClasses[] | null>(null);

  const titleRef = useRef<null | HTMLInputElement>(null);
  const description = useRef<null | HTMLInputElement>(null);
  const hasResources = useRef<null | HTMLInputElement>(null);

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();

    if (titleRef.current?.value && description.current?.value) {
      const newClass = await supabase.from<IClasses>("classes").insert({
        id: newId(),
        title: titleRef.current.value,
        description: description.current.value,
        has_resources: hasResources.current!.checked,
      });

      titleRef.current.value = "";
      description.current.value = "";
      hasResources.current!.value = "";

      if (newClass) {
        if (classes) {
          setClasses([...classes, newClass.data![0]]);
        }
      }
    }
  };

  const handleReleaseClass = async (e: MouseEvent, { id }: IClasses) => {
    e.preventDefault();
    const [date, timeSource] = new Date().toISOString().split("T");
    const time = timeSource.slice(0, 8);

    const dateTime = `${date} ${time}`;

    await supabase
      .from<IClasses>("classes")
      .update({
        released_at: dateTime,
      })
      .match({
        id,
      });

    if (classes) {
      setClasses(
        classes?.map((i) => (i.id === id ? { ...i, released_at: dateTime } : i))
      );
    }
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from<IClasses>("classes")
        .select("*")
        .order("created_at");
      if (error) {
        alert("Erro");
        setClasses([]);
        return;
      }
      setClasses(data);
    })();
  }, []);

  return (
    <div className="App">
      <form onSubmit={handleForm}>
        <label htmlFor="">title</label>
        <input ref={titleRef} type="text" />
        <label htmlFor="">description</label>
        <input ref={description} type="text" />
        <label htmlFor="">has resources</label>
        <input ref={hasResources} type="checkbox" />
        <button type="submit">save</button>
      </form>
      <ul>
        {classes?.map((i) => (
          <li key={i.id}>
            {i.released_at && "[v]"}
            {i.title}{" "}
            <a onClick={(e) => handleReleaseClass(e, i)} href="#">
              release
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
