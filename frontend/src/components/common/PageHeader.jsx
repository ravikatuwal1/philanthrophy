import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import './PageHeader.css';

export default function PageHeader({ title, subtitle, right }) {
  return (
    <div className="page-header">
      <div className="container d-flex align-items-start justify-content-between gap-3 flex-wrap">
        <div>
          <Breadcrumbs />
          <h1 className="page-title mt-2">{title}</h1>
          {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
        </div>
        {right ? <div className="page-header-right">{right}</div> : null}
      </div>
    </div>
  );
}