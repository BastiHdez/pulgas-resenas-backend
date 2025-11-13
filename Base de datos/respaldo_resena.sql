--
-- PostgreSQL database dump
--

\restrict tzlEyFNZvR9eKhbeskWir3R3Luc1HJSR70IgFf41luIXD2s49Lajyh6QIgyoIiZ

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: puntuacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.puntuacion (
    id_puntuacion uuid DEFAULT gen_random_uuid() CONSTRAINT puntuaciones_id_puntuacion_not_null NOT NULL,
    id_vendedor bigint CONSTRAINT puntuaciones_id_vendedor_not_null NOT NULL,
    id_comprador bigint CONSTRAINT puntuaciones_id_comprador_not_null NOT NULL,
    puntuacion integer CONSTRAINT puntuaciones_puntuacion_not_null NOT NULL,
    CONSTRAINT puntuaciones_puntuacion_check CHECK (((puntuacion >= 1) AND (puntuacion <= 5)))
);


ALTER TABLE public.puntuacion OWNER TO postgres;

--
-- Name: resena; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resena (
    id_resena uuid DEFAULT gen_random_uuid() CONSTRAINT resenas_id_resena_not_null NOT NULL,
    id_producto bigint CONSTRAINT resenas_id_producto_not_null NOT NULL,
    id_comprador bigint CONSTRAINT resenas_id_comprador_not_null NOT NULL,
    id_vendedor bigint CONSTRAINT resenas_id_vendedor_not_null NOT NULL,
    comentario text,
    puntuacion integer CONSTRAINT resenas_puntuacion_not_null NOT NULL,
    fecha_resena timestamp without time zone DEFAULT CURRENT_DATE,
    nombre_comprador character varying(100) NOT NULL,
    CONSTRAINT resenas_puntuacion_check CHECK (((puntuacion >= 1) AND (puntuacion <= 5)))
);


ALTER TABLE public.resena OWNER TO postgres;

--
-- Name: voto_resena; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.voto_resena (
    id_voto uuid DEFAULT gen_random_uuid() NOT NULL,
    id_resena uuid NOT NULL,
    id_usuario bigint NOT NULL,
    voto boolean NOT NULL
);


ALTER TABLE public.voto_resena OWNER TO postgres;

--
-- Data for Name: puntuacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.puntuacion (id_puntuacion, id_vendedor, id_comprador, puntuacion) FROM stdin;
\.


--
-- Data for Name: resena; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resena (id_resena, id_producto, id_comprador, id_vendedor, comentario, puntuacion, fecha_resena, nombre_comprador) FROM stdin;
\.


--
-- Data for Name: voto_resena; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.voto_resena (id_voto, id_resena, id_usuario, voto) FROM stdin;
\.


--
-- Name: puntuacion puntuaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.puntuacion
    ADD CONSTRAINT puntuaciones_pkey PRIMARY KEY (id_puntuacion);


--
-- Name: resena resenas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resena
    ADD CONSTRAINT resenas_pkey PRIMARY KEY (id_resena);


--
-- Name: voto_resena voto_resena_id_resena_id_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voto_resena
    ADD CONSTRAINT voto_resena_id_resena_id_usuario_key UNIQUE (id_resena, id_usuario);


--
-- Name: voto_resena voto_resena_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voto_resena
    ADD CONSTRAINT voto_resena_pkey PRIMARY KEY (id_voto);


--
-- Name: voto_resena voto_resena_id_resena_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voto_resena
    ADD CONSTRAINT voto_resena_id_resena_fkey FOREIGN KEY (id_resena) REFERENCES public.resena(id_resena) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict tzlEyFNZvR9eKhbeskWir3R3Luc1HJSR70IgFf41luIXD2s49Lajyh6QIgyoIiZ

