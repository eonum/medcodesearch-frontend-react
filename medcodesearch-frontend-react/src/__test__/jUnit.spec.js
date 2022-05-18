import {render} from "@testing-library/react";
import App from "../App";
import Header from "../Components/Header/header";

describe('Rendering Components', () => {
    test('render Header', () => {
        render(<Header/>);
        const languageDe = screen.getByText(/de/i)
        expect(languageDe).toBeInTheDocument();
    });

})