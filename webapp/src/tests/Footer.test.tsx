import {render} from "@testing-library/react";
import Footer from "../components/Footer";

test("Footer renders correctly", () => {

    const {getByText} = render(<Footer/>);

    expect(getByText("Made with")).toBeInTheDocument();
    expect(getByText("in Asturias")).toBeInTheDocument();

});
