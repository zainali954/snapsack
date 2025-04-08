import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../slices/uiSlice';
import { ToggleOffIcon, ToggleOnIcon } from 'hugeicons-react';

const ThemeToggle = () => {
  const { theme, expanded } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.classList.toggle("dark", theme === 'dark');
  }, []);

  const toggleTheme = () => {
    document.body.classList.toggle("dark");
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))
  }

  return (

    <button onClick={toggleTheme} className="relative flex gap-2 items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group hover:bg-gray-100 text-gray-600 hover:text-gray-900  dark:hover:bg-zinc-700 dark:text-gray-400 dark:hover:text-gray-200">
      {theme === 'dark' ? <ToggleOffIcon size={24} /> : <ToggleOnIcon size={24} />}
      <div className={`flex justify-between items-center w-full overflow-hidden transition-all ${expanded ? "w-full" : "w-0 hidden"}`} >
        <span className="text-left "> {theme === 'dark' ? 'Light' : 'Dark'} </span>
      </div>

      {!expanded && (
        <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-50 text-gray-800 dark:bg-zinc-800 dark:text-gray-300 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
          {theme}
        </div>
      )}
    </button>

  );
};

export default ThemeToggle;
