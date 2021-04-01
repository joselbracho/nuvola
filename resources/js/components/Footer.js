import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Footer = () => (
  <footer className="text-center footer-app">
      <p className="text-sm d-inline-block">
    	for Nuvola - &copy;{(new Date()).getFullYear()} Eng. Jose Luis Bracho Escobar
      </p>
  </footer>
);

export default Footer;
