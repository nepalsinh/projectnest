import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { SiGithub } from 'react-icons/si';
import { AuthService } from '../helpers/AuthService';
import { Logo } from './Logo';

function Layout() {
    const navigate = useNavigate();

    return (
        <>
            <Navbar
                className="dark:bg-neutral-950/70 bg-neutral-200/70"
            >
                <NavbarContent>
                    <NavbarBrand>
                        <Link to={"/"} className="flex items-center gap-2">
                            <Logo />
                            <p className="font-semibold text-2xl">
                                <span className="text-blue-500">Project</span>Nest
                            </p>
                        </Link>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem>
                        <Link to={"/dashboard"}>DashBoard</Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    {localStorage.getItem("token") ? (
                        <NavbarItem>
                            <Button
                                onClick={() => {
                                    AuthService.logout();
                                    navigate("/auth");
                                }}
                                color="danger"
                                variant="flat"
                            >
                                Logout
                            </Button>
                        </NavbarItem>
                    ) : (
                        <NavbarItem>
                            <Button as={Link} to="/auth" color="primary" variant="flat">
                                Login
                            </Button>
                        </NavbarItem>
                    )}
                </NavbarContent>
                {/* <NavbarMenu>
                    <NavbarMenuItem>
                        <Link className="w-full" to="/favorites">
                            Favorites
                        </Link>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                        <Link className="w-full" to="/history">
                            History
                        </Link>
                    </NavbarMenuItem>
                </NavbarMenu> */}
            </Navbar>
            <Outlet />
            <footer className="bg-white dark:bg-neutral-950">
                <div className="container flex flex-col items-center justify-between p-6 mx-auto space-y-4 sm:space-y-0 sm:flex-row">
                    <Link to="/" className="flex items-center gap-2">
                        <Logo size={30} />
                        <p className="font-semibold text-xl">
                            <span className="text-blue-500">Project</span>Nest
                        </p>
                    </Link>

                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        © Copyright 2024. All Rights Reserved.
                    </p>

                    <div className="flex -mx-2">
                        <Link
                            to={"https://github.com/nepalsinh/projectnest"}
                            className="mx-2 text-neutral-600 transition-colors duration-300 dark:text-neutral-300 hover:text-emerald-500 dark:hover:text-emerald-400"
                            aria-label="Reddit"
                        >
                            <SiGithub />
                        </Link>
                    </div>
                </div>
            </footer>
        </>
    );
}



export default Layout;