/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";

export default function FileExplorer() {
  const [fileStructure, setFileStructure] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/mapFiles");
      const data = await response.json();
      setFileStructure(data);
    };

    fetchData();
  }, []);

  const renderStructure = (structure: any[]) =>
    structure.map(
      (item: {
        name:
          | boolean
          | ReactElement<any, string | JSXElementConstructor<any>>
          | Iterable<ReactNode>
          | Promise<AwaitedReactNode>
          | Key
          | null
          | undefined;
        type: string;
        children: any;
      }) => (
        <div key={String(item.name)} style={{ marginLeft: 20 }}>
          {item.type === "folder" ? (
            <strong>{item.name}</strong>
          ) : (
            <span>{item.name}</span>
          )}
          {item.children && renderStructure(item.children)}
        </div>
      )
    );

  return (
    <div>
      <h1>Estrutura de Arquivos</h1>
      <div>{renderStructure(fileStructure)}</div>
    </div>
  );
}
