import { useEffect } from "react";
const UsePreventReload = (isFormDirty) => {
    useEffect(() => {
      const handleBeforeUnload = (event) => {
        if (isFormDirty) {
          event.preventDefault();
          event.returnValue = "";
        }
      };
  
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }, [isFormDirty]);
  };
export default UsePreventReload;