import TopBar from "./TopBar";
import MainNav from "./MainNav";

const Header = () => {
    return (
        <header className="relative z-50 flex flex-col">
            <TopBar />
            <MainNav />
        </header>
    );
};

export default Header;
