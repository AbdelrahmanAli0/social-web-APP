import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
} from "@heroui/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Authcontext } from "../../Context/Authcontext";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};
 


export default function MyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { UserToken , clearusertoken } = useContext(Authcontext);
  const Isuserloggedin = !!UserToken;
  const menuItems = Isuserloggedin ? ["Profile", "Home"] : [  "Login","Register" ] ;
  const Navigate = useNavigate();

  function handlelogout(){
    Navigate("/Login");
    clearusertoken();
  }
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarBrand>
        <p className="font-bold text-inherit">Social</p>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          { !Isuserloggedin && <>
              <NavbarItem>
            <Link color="foreground" to="/Register">
              Register
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" to="/Login">
              Login
            </Link>
          </NavbarItem>
          </>}
          {Isuserloggedin && <NavbarItem>
            <Link color="foreground" to="/Home">
              Home
            </Link>
          </NavbarItem>}
        </NavbarContent>

      {Isuserloggedin &&   <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              //coud be change to the user image
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>

          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="settings">
              <Link to="/Profile" className="w-full block">
                Profile
              </Link>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={handlelogout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link className="w-full" to={" /${item}"} size="lg">
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
