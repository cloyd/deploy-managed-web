import { BrandLogo } from "../modules/Brand";
import { CardCentered } from "../modules/Card";
import { Link } from "../modules/Link";

export const PageNotFound = () => (
  <CardCentered>
    <Link to="/" className="mb-3">
      <BrandLogo>Managed</BrandLogo>
    </Link>
    <strong>404...</strong>
    <p>The page you’re looking for could not be found.</p>
    <strong>:(</strong>
  </CardCentered>
);
