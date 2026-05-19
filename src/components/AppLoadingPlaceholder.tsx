import React from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import pytchLogo from "../images/pytch-tight-crop.png";

export const AppLoadingPlaceholder = () => {
  return (
    <Modal
      className="AppLoadingPlaceholder"
      show={true}
      animation={false}
      centered
    >
      <Modal.Body>
        <div className="spinner-container">
          <div>
            <img
              className="mb-5"
              src={pytchLogo}
              alt="Pytch Logo"
              height="80"
            />
          </div>
          <Spinner />
        </div>
      </Modal.Body>
    </Modal>
  );
};
