"use strict";

 angular.module("config", [])

.constant("ENV", "dev")

.constant("VERSION", "1.1.2")

.constant("AUTH_BASE_URL", "http://cct-dev.highwire.org/svc/global-login")

.constant("API_BASE_URL", "http://localhost:8080/cyclades/ccts")

.constant("BASE_URL", "http://cct-dev.highwire.org/svc")

.constant("CITATION_BASE_URL", "http://services-content-dev-01.highwire.org/extract")

.constant("MODCATALOG_BASE_URL", "http://localhost:8080/cyclades/modcatalog")

.constant("CATALOG_BASE_URL", "http://localhost:8080/cyclades/catalog")

.constant("INDEXER_BASE_URL", "http://hw-search-dev.highwire.org/hwcctsindexing/services/cct")

.constant("INDEXER_INSTANCE", "cctadev")

;