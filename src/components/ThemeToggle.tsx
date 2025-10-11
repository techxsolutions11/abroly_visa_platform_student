// src/components/ThemeToggle.js
import { Button, Switch } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { CiDark, CiSun } from 'react-icons/ci';
import { RiMoonClearLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { setChangeTheme } from '../redux/slices/themeSlice';
import { IoMdSunny } from 'react-icons/io';
import { FaRegMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  // const [darkMode, setDarkMode] = useState(() => (localStorage.getItem('theme') == "dark"));
  const { darkMode } = useSelector((state: any) => state.theme)

  const dispatch = useDispatch()

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    // <Switch
    //   defaultSelected={darkMode}
    //   isSelected={darkMode}
    //   size="sm"
    //   color="default"
    //   onChange={()=>{
    //     // setDarkMode(!darkMode)
    //     dispatch(setChangeTheme(!darkMode))
    //   }}
    //   startContent={ <IoMdSunny />}
    //   endContent={ <CiDark  />}
    // />
    <Button
      isIconOnly
      variant='light'
      // color='primary'
      onPress={() => {
        dispatch(setChangeTheme(!darkMode))
      }}
    >
      {
        darkMode == true ? <IoMdSunny size={20} /> : <FaRegMoon size={20} />
      }
    </Button>

  );
};

export default ThemeToggle;
