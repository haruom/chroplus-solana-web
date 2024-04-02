--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.2 (Debian 16.2-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS qbrane;
--
-- Name: qbrane; Type: DATABASE; Schema: -; Owner: user
--

CREATE DATABASE qbrane WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE qbrane OWNER TO "user";

\connect qbrane

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: RecordEventType; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public."RecordEventType" AS ENUM (
    'SLEEP',
    'SELLDATA',
    'WITHDRAW'
);


ALTER TYPE public."RecordEventType" OWNER TO "user";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO "user";

--
-- Name: EncryptedSleepData; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."EncryptedSleepData" (
    id text NOT NULL,
    "userId" text NOT NULL,
    date date NOT NULL,
    "transactionHash" text NOT NULL,
    "keyStr" text NOT NULL,
    "ivStr" text NOT NULL
);


ALTER TABLE public."EncryptedSleepData" OWNER TO "user";

--
-- Name: Record; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."Record" (
    id integer NOT NULL,
    "userId" text NOT NULL,
    type public."RecordEventType" NOT NULL,
    amount bigint NOT NULL,
    "recordedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "sleepDuration" integer,
    "sleepDate" date
);


ALTER TABLE public."Record" OWNER TO "user";

--
-- Name: Record_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public."Record_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Record_id_seq" OWNER TO "user";

--
-- Name: Record_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public."Record_id_seq" OWNED BY public."Record".id;


--
-- Name: Session; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO "user";

--
-- Name: User; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text,
    "emailVerified" timestamp(3) without time zone,
    image text
);


ALTER TABLE public."User" OWNER TO "user";

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO "user";

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO "user";

--
-- Name: Record id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Record" ALTER COLUMN id SET DEFAULT nextval('public."Record_id_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: EncryptedSleepData; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."EncryptedSleepData" (id, "userId", date, "transactionHash", "keyStr", "ivStr") FROM stdin;
\.


--
-- Data for Name: Record; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."Record" (id, "userId", type, amount, "recordedAt", "sleepDuration", "sleepDate") FROM stdin;
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."User" (id, name, email, "emailVerified", image) FROM stdin;
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
e90caa1d-2816-4f23-8229-ae32cafc9b9d	bfda65ad1f36e1d32d5defb97a86425a9d222065d34e6bb5bc4f8b210b73284a	2024-03-30 14:30:05.339836+09	20240213142734_init	\N	\N	2024-03-30 14:30:05.326274+09	1
c5374eac-12bf-4242-af72-d0e46fa266f6	85270abc7719933b09fd31b6011021728a363109262bcc2b0f902ff54a816e38	2024-03-30 14:30:05.34612+09	20240310033044_sleepdata	\N	\N	2024-03-30 14:30:05.340947+09	1
8ff984a7-9052-456c-9a08-0b6d91798d8b	7d2ce20bd269d5d2c0db38a4e1c18c004e17839b7ab92e6c17a34714ffcdef61	2024-03-30 14:30:05.351248+09	20240311093441_add_record	\N	\N	2024-03-30 14:30:05.346989+09	1
242c7598-b04d-4d46-9168-024bd9defe54	5582683f511aaced214c7cbab5a03de6fd3e7fdf7274cef29f1434e1862204d3	2024-03-30 14:30:05.353142+09	20240311094919_	\N	\N	2024-03-30 14:30:05.351752+09	1
9bbf235e-f823-477f-81d6-573aaf549612	525e9e75b02ac63569a0130fa6615c21e0d5bcda5fda24c597790927c4fdcefe	2024-03-30 14:30:05.355756+09	20240312093004_	\N	\N	2024-03-30 14:30:05.353605+09	1
\.


--
-- Name: Record_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public."Record_id_seq"', 1, false);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: EncryptedSleepData EncryptedSleepData_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."EncryptedSleepData"
    ADD CONSTRAINT "EncryptedSleepData_pkey" PRIMARY KEY (id);


--
-- Name: Record Record_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Record"
    ADD CONSTRAINT "Record_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: EncryptedSleepData_userId_date_key; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX "EncryptedSleepData_userId_date_key" ON public."EncryptedSleepData" USING btree ("userId", date);


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EncryptedSleepData EncryptedSleepData_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."EncryptedSleepData"
    ADD CONSTRAINT "EncryptedSleepData_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Record Record_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Record"
    ADD CONSTRAINT "Record_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

