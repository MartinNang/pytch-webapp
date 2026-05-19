import React from "react";
import Modal from "react-bootstrap/Modal";
import pytchLogo from "../images/pytch-tight-crop.png";

export const I18nBootErrorModal = () => {
  return (
    <Modal
      className="I18nBootErrorModal"
      show={true}
      animation={false}
      centered
    >
      <Modal.Header>
        <Modal.Title>Error loading language information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="spinner-container">
          <div>
            <img
              className="home-link mb-5"
              src={pytchLogo}
              alt="Pytch Logo"
              height="80"
            />
          </div>
          <p>
            Apologies. Pytch could not start, because it could not set up the
            language information. Please contact the Pytch team if this problem
            persists.
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
};
