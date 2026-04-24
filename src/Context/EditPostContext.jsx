import { createContext, useState } from "react";

export const EditPostContext = createContext();

export default function EditPostContextProvider({ children }) {
  const [isEditmode, setIsEditmode] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <EditPostContext.Provider
      value={{ isEditmode, setIsEditmode, selectedPost, setSelectedPost }}
    >
      {children}
    </EditPostContext.Provider>
  );
}
