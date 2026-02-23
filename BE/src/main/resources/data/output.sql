--
-- PostgreSQL database dump
--

\restrict LltzBJngfpEg1XEtRQ7FnStf1xcBWZ88r2QpjJAIO6hi2wbYF10vejONQ2uxZyq

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


--
-- Name: selectbookings(); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.selectbookings()
    LANGUAGE plpgsql
    AS $$
begin
 select * from booking_details;
end;
$$;


ALTER PROCEDURE public.selectbookings() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: booking_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking_details (
    id bigint NOT NULL,
    booking_status character varying(255),
    created_at timestamp(6) without time zone,
    customer_id bigint,
    description character varying(255),
    is_active boolean NOT NULL,
    location character varying(255),
    service_id bigint,
    service_name character varying(255),
    service_provider_id bigint,
    postal_code character varying(255)
);


ALTER TABLE public.booking_details OWNER TO postgres;

--
-- Name: booking_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.booking_details_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.booking_details_id_seq OWNER TO postgres;

--
-- Name: booking_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.booking_details_id_seq OWNED BY public.booking_details.id;


--
-- Name: buisness_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buisness_category (
    id bigint NOT NULL,
    name character varying(255)
);


ALTER TABLE public.buisness_category OWNER TO postgres;

--
-- Name: buisness_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.buisness_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.buisness_category_id_seq OWNER TO postgres;

--
-- Name: buisness_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.buisness_category_id_seq OWNED BY public.buisness_category.id;


--
-- Name: buisness_category_keywords; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buisness_category_keywords (
    buisness_category_id bigint NOT NULL,
    keywords character varying(255)
);


ALTER TABLE public.buisness_category_keywords OWNER TO postgres;

--
-- Name: email_verification_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_verification_tokens (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    expiry timestamp(6) without time zone NOT NULL,
    token character varying(255) NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.email_verification_tokens OWNER TO postgres;

--
-- Name: email_verification_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.email_verification_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.email_verification_tokens_id_seq OWNER TO postgres;

--
-- Name: email_verification_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.email_verification_tokens_id_seq OWNED BY public.email_verification_tokens.id;


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    id bigint NOT NULL,
    service_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorites_id_seq OWNER TO postgres;

--
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- Name: flyway_schema_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flyway_schema_history (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


ALTER TABLE public.flyway_schema_history OWNER TO postgres;

--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    id bigint NOT NULL,
    booking_id bigint NOT NULL,
    message character varying(255),
    notification_title character varying(255),
    notification_type character varying(255),
    priority character varying(255),
    read boolean,
    "timestamp" timestamp(6) without time zone,
    user_id bigint,
    is_active boolean
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notification_id_seq OWNER TO postgres;

--
-- Name: notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_id_seq OWNED BY public.notification.id;


--
-- Name: refresh_token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_token (
    id bigint NOT NULL,
    expiry_date timestamp(6) without time zone,
    is_revoked boolean NOT NULL,
    token character varying(255),
    user_id bigint
);


ALTER TABLE public.refresh_token OWNER TO postgres;

--
-- Name: refresh_token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refresh_token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_token_id_seq OWNER TO postgres;

--
-- Name: refresh_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refresh_token_id_seq OWNED BY public.refresh_token.id;


--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id bigint NOT NULL,
    description character varying(255),
    name character varying(255)
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_id_seq OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- Name: service_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_images (
    id bigint NOT NULL,
    image_url character varying(255),
    public_id character varying(255),
    service_id bigint NOT NULL
);


ALTER TABLE public.service_images OWNER TO postgres;

--
-- Name: service_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.service_images ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.service_images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id bigint NOT NULL,
    address character varying(255),
    city character varying(255),
    company_name character varying(255),
    email character varying(255),
    phone character varying(255),
    postal_code character varying(255),
    website character varying(255),
    business_category_id bigint NOT NULL,
    service_provider_id bigint NOT NULL,
    keywords character varying(1000)
);


ALTER TABLE public.services OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.services_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.services_id_seq OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: services_keywords; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services_keywords (
    services_id bigint NOT NULL,
    keywords character varying(255)
);


ALTER TABLE public.services_keywords OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id bigint NOT NULL,
    role_id bigint NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying(255),
    name character varying(255),
    password character varying(255),
    phone character varying(255),
    is_verified boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: booking_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_details ALTER COLUMN id SET DEFAULT nextval('public.booking_details_id_seq'::regclass);


--
-- Name: buisness_category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buisness_category ALTER COLUMN id SET DEFAULT nextval('public.buisness_category_id_seq'::regclass);


--
-- Name: email_verification_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification_tokens ALTER COLUMN id SET DEFAULT nextval('public.email_verification_tokens_id_seq'::regclass);


--
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- Name: notification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification ALTER COLUMN id SET DEFAULT nextval('public.notification_id_seq'::regclass);


--
-- Name: refresh_token id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_token ALTER COLUMN id SET DEFAULT nextval('public.refresh_token_id_seq'::regclass);


--
-- Name: role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: booking_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booking_details (id, booking_status, created_at, customer_id, description, is_active, location, service_id, service_name, service_provider_id, postal_code) FROM stdin;
3	pending	2025-07-27 20:54:20.366687	5	tamil	t	hyderabad,tamilnadu	1	DAYTONA	1	\N
5	pending	2025-08-12 09:14:28.342032	5	chicken	t	chennai,tamilnadu	2	PROPEL	1	\N
2	accepted	2025-07-27 20:39:13.813437	5	shake it 	t	Tamilnadu,chennai	2	PROPEL	1	\N
4	cancelled	2025-07-27 20:59:12.035533	5	yy	f	th,uu	1	DAYTONA	1	\N
10	pending	2026-01-28 08:38:22.893746	5	m	t	m,n	25	\N	\N	\N
11	pending	2026-01-29 23:35:23.710266	5	AC not cooling	t	Chennai	1	\N	\N	\N
12	pending	2026-01-29 23:35:48.397856	5	AC not cooling	t	Chennai	1	\N	\N	\N
13	pending	2026-01-29 23:35:55.960267	5	AC not cooling	t	Chennai	1	\N	\N	\N
14	pending	2026-01-29 23:40:22.454689	5	AC not cooling	t	Chennai	1	\N	\N	\N
15	pending	2026-01-29 23:41:39.419055	5	AC not cooling	t	Chennai	1	\N	\N	\N
16	pending	2026-01-29 23:54:40.672082	5	AC not cooling	t	Chennai	1	\N	\N	\N
17	pending	2026-01-29 23:54:51.092618	5	AC not cooling	t	Chennai	1	\N	\N	\N
18	pending	2026-01-29 23:54:57.305844	5	AC not cooling	t	Chennai	1	\N	\N	\N
19	pending	2026-01-29 23:56:06.677216	5	AC not cooling	t	Chennai	1	\N	\N	\N
20	pending	2026-01-29 23:57:00.641845	5	AC not cooling	t	Chennai	1	\N	\N	\N
22	pending	2026-02-01 16:18:49.78593	5	AC not cooling	t	Chennai	1	\N	\N	\N
23	pending	2026-02-01 16:23:46.678122	5	AC not cooling	t	Chennai	1	\N	\N	\N
24	pending	2026-02-01 16:23:51.230815	5	AC not cooling	t	Chennai	1	\N	\N	\N
25	pending	2026-02-01 17:55:34.7465	5	AC not cooling	t	Chennai	1	\N	\N	\N
26	pending	2026-02-01 18:00:06.961907	5	AC not cooling	t	Chennai	1	\N	\N	\N
1	cancelled	2025-07-19 16:55:43.781906	1	sqa	f	sa,was	2	PROPEL	1	\N
8	accepted	2026-01-26 23:45:46.688521	5	s	t	s,s	3	\N	\N	\N
7	rejected	2026-01-26 23:41:20.905729	5	kalyanam	f	ah,ah	3	\N	\N	\N
9	cancelled	2026-01-28 07:57:39.291065	5	t	f	t,t	3	\N	\N	\N
21	cancelled	2026-01-29 23:58:12.481981	5	AC not cooling	f	Chennai	1	\N	\N	\N
6	accepted	2026-01-26 17:56:39.58898	5	unga vijay ungal vijay	t	chennai,tamilaga vetri kalagam 	3	\N	\N	\N
\.


--
-- Data for Name: buisness_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.buisness_category (id, name) FROM stdin;
1	TECH_SOLUTIONS
2	Packers and Movers
30	Home food
31	Doctors
32	Travel agencies
33	Auto Services
34	Home Services
35	Learning and tutoring
36	AC Repair
37	Plumbing
38	Electrical
39	House Cleaning
40	Car Service
42	Gardening Services
43	Hair salon
\.


--
-- Data for Name: buisness_category_keywords; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.buisness_category_keywords (buisness_category_id, keywords) FROM stdin;
1	tech solutions
2	Parcel 
30	food
30	restaurant
30	dining
30	meal
30	cooking
30	home food
31	doctor
31	health
31	medical
31	clinic
31	appointment
31	healthcare
32	travel
32	trip
32	vacation
32	journey
32	adventure
32	tour
33	car
33	auto
33	vehicle
33	repair
33	maintenance
33	service
34	home
34	repair
34	maintenance
34	electric
34	house cleaning
34	fix
35	education
35	tutoring
35	learning
35	teaching
35	lessons
35	classes
36	AC
36	air conditioning
36	cooling
36	temperature
36	repair
36	service
37	plumbing
37	pipe
37	leak
37	water
37	repair
37	maintenance
38	electrical
38	wiring
38	electric
38	power
38	installation
38	repair
39	cleaning
39	house
39	home
39	wash
39	dust
39	tidy
40	car
40	vehicle
40	auto
40	service
40	repair
40	maintenance
42	gardening
42	garden
42	plants
42	landscaping
42	maintenance
42	yard
39	House Cleaning
38	Electrical
36	AC Repair
37	Plumbing
40	Car Service
2	Packers and Movers
31	Doctors
30	Home food
34	Home Services
35	Learning and tutoring
2	moving
2	relocation
2	packers
2	movers
2	transport
2	shift
43	Hair salon
43	salon
43	Hair stylist
\.


--
-- Data for Name: email_verification_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_verification_tokens (id, created_at, expiry, token, user_id) FROM stdin;
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (id, service_id, user_id) FROM stdin;
4	3	5
6	43	5
7	30	5
\.


--
-- Data for Name: flyway_schema_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) FROM stdin;
1	1	init schema	SQL	V1__init_schema.sql	-1213700545	postgres	2025-07-15 08:40:44.074025	118	t
2	2	adding missing indexex	SQL	V2__adding_missing_indexex.sql	-1987912268	postgres	2025-07-15 22:40:03.088164	17	t
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification (id, booking_id, message, notification_title, notification_type, priority, read, "timestamp", user_id, is_active) FROM stdin;
11	5	New booking request from customer: 1	New Booking Request	pending	\N	f	2025-07-16 23:21:57.550987	1	\N
12	4	Your booking request for service: PROPEL has been rejected	rejected	rejected	\N	f	2025-07-16 23:30:25.237497	1	\N
13	5	Your booking request for service: DAYTONA has been rejected	rejected	rejected	\N	f	2025-07-16 23:32:10.941936	1	\N
14	1	Your booking request for service: DAYTONA has been rejected	rejected	rejected	\N	f	2025-07-16 23:35:49.834047	1	\N
15	1	Your booking request for service: DAYTONA has been rejected	rejected	rejected	\N	f	2025-07-16 23:38:25.276429	1	\N
16	2	Your booking request for service: PROPEL has been rejected	rejected	rejected	\N	f	2025-07-17 07:35:34.050414	1	\N
17	6	New booking request from customer: 1	New Booking Request	pending	\N	f	2025-07-17 07:56:21.979049	1	\N
18	7	New booking request from customer: 1	New Booking Request	pending	\N	f	2025-07-17 08:22:11.633243	1	\N
19	8	New booking request from customer: 1	New Booking Request	pending	\N	f	2025-07-17 08:42:46.763482	1	\N
20	6	Your booking request for service: PROPEL has been rejected	rejected	rejected	\N	f	2025-07-17 08:43:14.149798	1	\N
21	9	New booking request from customer: 1	New Booking Request	pending	\N	f	2025-07-19 12:11:54.954837	1	\N
22	8	Your booking request for service: PROPEL has been rejected	rejected	rejected	\N	f	2025-07-19 12:12:24.850338	1	\N
23	10	New booking request from customer: 1	New Booking Request	pending	\N	f	2025-07-19 13:12:02.779846	1	\N
24	2	Your booking request for service: PROPEL has been rejected	rejected	rejected	\N	f	2025-07-19 14:25:44.047147	1	\N
25	2	Your booking request for service: PROPEL has been rejected	rejected	rejected	\N	f	2025-07-19 14:26:19.681265	1	\N
26	11	New booking request from customer: 1	New Booking Request	pending	\N	f	2025-07-19 14:27:26.383092	1	\N
27	11	Your booking request for service: PROPEL has been rejected	rejected	rejected	\N	f	2025-07-19 16:03:58.953434	1	\N
28	2	Your booking request for service: PROPEL has been rejected	rejected	rejected	\N	f	2025-07-19 16:06:16.429474	1	\N
29	12	New booking request from customer: 1	New Booking Request	pending	\N	f	2025-07-19 16:06:48.929622	1	\N
30	1	New booking request from customer: 1	New Booking Request	pending	\N	f	2025-07-19 16:55:43.822658	1	\N
31	1	Your booking request for service: PROPEL has been rejected	rejected	rejected	\N	f	2025-07-19 16:59:40.195212	1	\N
32	1	Your booking request for service: PROPEL has been rejected	rejected	rejected	\N	f	2025-07-19 17:05:14.542491	1	\N
33	1	Your booking request for service: PROPEL has been rejected	rejected	rejected	\N	f	2025-07-19 17:11:16.327388	1	\N
34	1	Your booking request for service: PROPEL has been rejected	rejected	rejected	\N	f	2025-07-19 17:11:56.927689	1	\N
35	1	Your booking request for service: PROPEL has been rejected	rejected	rejected	\N	f	2025-07-19 17:50:49.765136	1	\N
36	2	New booking request from customer: 5	New Booking Request	pending	\N	f	2025-07-27 20:39:13.925197	1	\N
1	5	New booking request from customer: 1	New Booking Request	requested	\N	t	2025-07-16 21:49:50.838461	1	\N
2	6	New booking request from customer: 1	New Booking Request	pending	\N	t	2025-07-16 22:23:36.807673	1	\N
3	1	New booking request from customer: 1	New Booking Request	pending	\N	t	2025-07-16 22:24:07.806068	1	\N
4	1	Your booking request for service: DAYTONA has been rejected	rejected	rejected	\N	t	2025-07-16 22:27:50.08012	1	\N
5	1	Your booking request for service: DAYTONA has been rejected	rejected	rejected	\N	t	2025-07-16 22:29:23.176456	1	\N
6	1	Your booking request for service: DAYTONA has been cancelled	rejected	rejected	\N	t	2025-07-16 22:32:50.82928	1	\N
7	1	Your booking request for service: DAYTONA has been rejected	rejected	rejected	\N	t	2025-07-16 22:33:35.682708	1	\N
8	2	New booking request from customer: 1	New Booking Request	pending	\N	t	2025-07-16 22:34:54.587538	1	\N
9	3	New booking request from customer: 1	New Booking Request	pending	\N	t	2025-07-16 22:35:42.947461	1	\N
10	4	New booking request from customer: 1	New Booking Request	pending	\N	t	2025-07-16 22:56:23.360359	1	\N
37	3	New booking request from customer: 5	New Booking Request	pending	\N	f	2025-07-27 20:54:20.400622	1	\N
39	5	New booking request from customer: 5	New Booking Request	pending	\N	f	2025-08-12 09:14:28.430057	1	\N
45	10	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-01-28 08:38:22.96569	130	\N
46	11	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-01-29 23:35:23.733149	1	\N
47	12	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-01-29 23:35:48.400556	1	\N
48	13	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-01-29 23:35:55.968236	1	\N
49	14	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-01-29 23:40:22.464234	1	\N
50	15	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-01-29 23:41:39.432679	1	\N
51	16	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-01-29 23:54:40.715101	1	\N
52	17	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-01-29 23:54:51.120706	1	\N
53	18	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-01-29 23:54:57.309101	1	\N
54	19	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-01-29 23:56:06.682659	1	\N
55	20	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-01-29 23:57:00.656967	1	\N
56	21	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-01-29 23:58:12.52403	1	\N
57	22	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-02-01 16:18:49.79867	1	\N
38	4	New booking request from customer: 5	New Booking Request	pending	\N	t	2025-07-27 20:59:12.096783	5	t
41	6	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-01-26 17:56:39.649878	5	f
43	8	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-01-26 23:45:46.716246	5	f
44	9	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-01-28 07:57:39.305552	5	f
58	23	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-02-01 16:23:46.709988	1	\N
59	24	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-02-01 16:23:51.237816	1	\N
60	25	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-02-01 17:55:34.759601	1	\N
61	26	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-02-01 18:00:07.014502	1	\N
62	1	Your booking request for service has been cancelled	rejected	rejected	\N	f	2026-02-10 22:44:45.151212	1	\N
63	7	Your booking request for service has been rejected	rejected	rejected	\N	f	2026-02-10 23:55:23.428829	5	\N
64	9	Your booking request for service has been cancelled	rejected	rejected	\N	f	2026-02-11 22:33:05.11051	5	\N
42	7	New booking request from customer: 5	New Booking Request	pending	\N	f	2026-01-26 23:41:20.963088	5	f
40	4	Your booking request for service: DAYTONA has been cancelled	rejected	rejected	\N	t	2026-01-07 22:11:09.16927	5	f
65	21	Your booking request for service has been cancelled	rejected	rejected	\N	f	2026-02-12 08:52:19.8674	5	t
\.


--
-- Data for Name: refresh_token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_token (id, expiry_date, is_revoked, token, user_id) FROM stdin;
2	2025-07-19 09:36:35.211	f	efa72e56-10b5-468f-be1c-8de4143202c8	1
3	2025-07-19 11:20:07.985	f	31101409-4372-4b46-9bfe-890da0278469	1
9	2025-07-22 04:50:43.22	f	fe579113-248d-47b3-92bb-440447c5da74	1
261	2026-02-11 10:45:45.669	t	555df903-44dd-4921-9d18-07bf81a72906	5
12	2025-07-30 08:47:03.764	t	42829269-3367-42e9-87b2-1e9140f6f933	1
262	2026-02-11 10:47:40.824	t	8513c4d9-97eb-4bc7-86c9-fc6cfb32cc9c	5
265	2026-02-12 09:12:43.438	f	50ed37c1-61b8-4298-98a6-5eac7cfade89	5
18	2025-07-30 11:27:51.554	f	3f0a80d1-a477-41e0-b221-e567f7d34cef	6
19	2025-07-30 11:28:49.914	f	49d5e57a-4b6e-4ccc-aeb5-507453e87e95	6
20	2025-08-13 01:01:54.559	t	d4b39f8e-bcae-45d5-ad30-f504b9fce01a	6
319	2026-02-20 19:41:15.572	t	02ab8ab1-b673-4bf3-ac01-efa4c97278db	5
22	2025-08-13 01:03:42.481	f	3a28c006-c3db-4618-95b4-145d121a3aa4	6
23	2025-08-13 03:57:24.673	f	a6d8ff9f-d1df-4c23-b3b8-e50003ef0d2f	6
24	2025-08-13 03:58:29.081	t	fdd0200c-d7e1-4933-bc23-3b5ba715383f	6
267	2026-02-12 11:36:14.094	t	8f06174e-765b-4b9e-961d-8bb4992be881	5
28	2025-08-13 08:17:34.441	t	8633ffed-3b9f-4e6e-ab96-429b86c86d64	6
29	2025-08-13 08:18:32.922	f	b31404b2-89e0-4986-9f94-00aea3fa6153	6
30	2025-08-13 19:15:42.557	f	818f2eac-348c-4a6f-b956-5a0afe8afe8f	6
270	2026-02-12 20:05:56.63	t	7a4f610f-50e9-4cfa-973c-068d81b14684	142
33	2025-08-14 20:02:07.861	f	aa84af6b-799b-4dba-9fbe-85fc16f900bf	6
34	2025-08-14 20:11:13.585	t	3c7d8ba2-a74e-403b-bccc-585ef56d5d4a	6
39	2025-08-15 09:28:32.769	t	e101b4dc-9654-4a80-8acc-b43bc4d04944	1
41	2025-08-15 09:29:54.314	t	37323272-c348-4436-9cf6-fc7aaa8406dc	6
42	2025-08-15 10:24:21.287	t	75255a19-af92-45b6-8feb-ede1be95d38e	1
43	2025-08-15 11:44:13.529	f	74206ffd-e31b-4ad7-a376-ac460e6ee46c	6
271	2026-02-12 20:10:51.791	t	fcc5ff7d-8212-44eb-9d1d-1d116c35a2b9	5
45	2025-08-15 19:02:53.3	t	ce90d9b2-b57f-4034-a101-97509c66916c	6
46	2025-08-15 19:12:40.871	t	93a3cfdc-c101-4bd2-8cff-bc96ff208c3a	6
47	2025-08-15 19:13:12.324	f	80261eeb-ef75-49a9-9bad-2498d91e05ca	1
275	2026-02-13 11:45:34.605	f	c47ec6db-7643-4d79-ae43-412512378d84	5
272	2026-02-13 09:44:58.677	t	94be4407-269a-4179-8573-b93aeaf61401	5
277	2026-02-13 20:53:41.527	t	bbb11b53-96a0-4710-832e-06e16b9a83ed	5
278	2026-02-13 21:02:58.109	t	773ec76b-1375-42b9-8b8c-0ad6ef6b2404	5
281	2026-02-14 19:42:48.435	f	17142402-fc2e-4adb-8073-a370ca385b0b	5
280	2026-02-14 10:32:46.329	t	f0c0c09f-6eeb-43c2-bc2d-3a8318a2761c	5
286	2026-02-17 07:55:44.733	f	bdd0bf88-23dc-4c66-b225-977487a342e0	5
284	2026-02-14 20:52:01.587	t	66ca409c-0795-4192-abdf-a747f1448a89	5
291	2026-02-17 08:41:57.747	f	cea06e42-dff6-4b86-a6c5-db6a6bf9b0db	142
292	2026-02-17 08:44:57.247	t	63041e88-a8d7-4f89-a499-9f422255ed17	142
293	2026-02-17 08:45:56.821	t	b55defd0-48d8-42e9-be37-569bb7aae15a	142
294	2026-02-17 08:47:29.936	f	ed191039-2faf-4433-b554-59df13d7a1cd	142
297	2026-02-17 09:11:30.804	f	eeaa654e-816c-4337-916d-6b9492cc68fa	5
300	2026-02-17 09:19:16.345	t	26f1652b-21d6-4b50-962d-f870e28de85a	5
301	2026-02-17 09:22:01.436	t	76e31012-def1-403e-9b36-de3d5679aa59	142
302	2026-02-17 09:22:44.047	t	15ddb22c-43f6-4a74-aaf4-1dc57e052c6f	5
304	2026-02-17 09:26:04.009	t	aa2760bb-e531-4913-8d6e-576673342684	5
307	2026-02-18 06:10:59.713	t	d9fb8773-d9af-474d-aa94-41c5d1c1b936	142
311	2026-02-18 09:42:25.11	f	44b162ac-2c40-44b4-8ac3-96d8ff733b04	5
313	2026-02-18 10:01:40.562	f	5a7c5a42-2342-4e73-91f9-4e2577e9924a	5
315	2026-02-19 09:43:37.524	t	2b090b76-5611-4fd8-8672-a3921cd46b29	5
316	2026-02-19 09:43:37.703	t	15535da4-876c-404e-96aa-0d934b8c34e7	5
123	2026-01-04 06:40:13.243	f	5b648aa0-5591-4f46-9cbc-2cd4561f5382	6
317	2026-02-19 09:43:38.531	t	ff6cc5ec-cb0a-4077-a091-becac51f88f0	5
263	2026-02-11 20:58:26.24	f	b423c933-5fa2-45eb-8ebb-4440bce13e9e	5
266	2026-02-12 09:12:43.438	f	cc9bc077-36e4-4672-b041-23a324c786bb	5
264	2026-02-11 20:58:26.24	t	49eec3e1-74a2-4bd9-bec2-e2b2fd8334c9	5
269	2026-02-12 19:28:46.641	f	21fe5424-3c47-431b-984e-5366f79416a0	5
143	2026-01-22 09:42:35.982	f	a324120e-d01c-4f50-8942-c08011fc1680	140
268	2026-02-12 19:28:46.639	t	67ba319a-7895-4c4d-a5dc-62f6cb84f82a	5
273	2026-02-13 09:44:58.677	f	65809a10-4563-4b1c-b9a2-7a5b4bf6ed79	5
274	2026-02-13 11:45:34.605	t	38d7ae76-06fd-4224-8341-d8289dc92be6	5
276	2026-02-13 20:00:38.14	t	dad3300a-cb1c-411f-8776-169ca688146d	5
279	2026-02-14 10:32:46.329	f	e8446000-0967-407b-9007-7e50ea2d7eaf	5
282	2026-02-14 19:42:48.435	t	2ce14bc5-0e38-4966-a789-568ccc6a9b95	5
283	2026-02-14 20:49:11.045	t	b3351c35-4bcf-4686-996d-f0106cdbe50f	142
285	2026-02-17 07:55:44.733	t	e3fef424-2cc0-43e8-9255-3e4526443010	5
287	2026-02-17 07:56:06.04	f	61f6b5ee-6aec-4fcb-b212-c6f8dd10dfcd	142
288	2026-02-17 07:56:57.119	f	9ac8da9d-10a6-43d1-9b8f-65ef2b92be9d	142
289	2026-02-17 08:05:11.595	f	b5b90958-9aa3-46b2-aca1-cc143a52a285	142
290	2026-02-17 08:12:00.851	f	293ebe6a-a8bb-4371-926a-56de12404cb8	142
295	2026-02-17 08:53:38.214	f	87f1ce1e-515f-42c4-a124-3f58d90499a8	142
296	2026-02-17 09:01:53.821	f	58337af1-58c5-40be-8488-54fb8d5fc0b8	5
298	2026-02-17 09:15:36.364	t	6e28bf54-b00e-437f-bc7b-0a2d6a394790	5
299	2026-02-17 09:16:35.368	t	3998e045-12bf-4e82-8b23-82f16eaa911d	142
303	2026-02-17 09:25:35.046	t	abf9db5b-5cbb-466f-8b61-d29b11846d20	142
306	2026-02-18 06:10:59.713	f	bdaae8f6-6a18-45f0-92ee-b0903ffda82b	142
305	2026-02-17 09:38:24.322	t	5b54616e-6cac-41c4-81a3-842be22d4c4b	142
310	2026-02-18 08:20:19.271	f	ec262fe3-e546-46da-8952-c0cb3f1ccd6a	5
309	2026-02-18 08:20:19.271	f	a74ab8ff-5226-49b2-a621-c702536d8969	5
308	2026-02-18 06:11:16.438	t	f29460aa-2af8-47a4-b37b-bbe05098942e	5
312	2026-02-18 09:45:43.501	f	83cf4630-8ffd-4dd4-ac3f-8e62af289d5a	5
314	2026-02-19 09:27:43.788	t	a8ba17a5-a030-4f44-a61d-b117e0c6d453	5
318	2026-02-20 19:41:15.572	f	8761add3-1008-423d-86fb-9ffd456feb0c	5
320	2026-02-22 20:01:14.962	f	cc58c538-b9bd-4cae-8626-505859f18bf2	5
321	2026-02-22 20:01:14.962	f	17f48017-4f7e-45df-893a-9d2c98ee90d3	5
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (id, description, name) FROM stdin;
3	Service Provider	PROVIDER
1	App user	USER
2	Administrator	ADMIN
\.


--
-- Data for Name: service_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_images (id, image_url, public_id, service_id) FROM stdin;
1	https://res.cloudinary.com/dndkbxr9v/image/upload/v1771554901/justsearch/services/46/o22ubgy69ls3s3lqhag0.jpg	justsearch/services/46/o22ubgy69ls3s3lqhag0	46
2	https://res.cloudinary.com/dndkbxr9v/image/upload/v1771554903/justsearch/services/46/cvfpf9trronmbposebhk.jpg	justsearch/services/46/cvfpf9trronmbposebhk	46
3	https://res.cloudinary.com/dndkbxr9v/image/upload/v1771554904/justsearch/services/46/c330hgst9yjjlbngou18.jpg	justsearch/services/46/c330hgst9yjjlbngou18	46
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, address, city, company_name, email, phone, postal_code, website, business_category_id, service_provider_id, keywords) FROM stdin;
1	MG Road , Bangalore	Bangalore	DAYTONA	reachout@Daytona.com	09134567801	600016	\N	1	1	\N
3	Alandur,chennai	Chennai	Selvam Packers and Movers	selvam@gmail.com	9876543210	600016	\N	2	5	\N
42	Chennai (relocation)	Chennai	Fast Help Packers	info@fasthelp.in		600001	\N	2	139	\N
43	Chennai (various)	Chennai	HomeTriangle Movers	info@hometriangle.com		600001	\N	2	134	\N
14	Anna Nagar	Chennai	Tiffit	info@tiffit.com	+91-44-12345678	600040	\N	30	119	\N
15	Madippakkam	Chennai	Vadumangai	orders@vadumangai.com	+91-98400-12345	600091	\N	30	120	\N
16	Adyar	Chennai	Maavadu	contact@maavadu.in	+91-44-28512345	600020	\N	30	121	\N
17	Sringeri Mutt Rd RA Puram 	Chennai	Dhivi's Kitchen	dhivi@dhivikitchen.com	+91-98412-34567	600028	\N	30	122	\N
18	Medavakkam	Chennai	DailyBox	hello@dailybox.co.in	+91-44-40012345	600100	\N	30	123	\N
19	Anna Nagar East	Chennai	Selvarangam Hospital	info@selvarangamhospital.com	044-26261212	600102	\N	31	124	\N
20	Q-102 3rd Ave Block Q Anna Nagar	Chennai	Rathimed Speciality Hospital	info@rathimedhospital.com	044-26261212	600040	\N	31	125	\N
21	3rd Ave Block E Annanagar East	Chennai	Vihaa Multispeciality Hospital	vihaahospital2017@gmail.com	+91-9710400000	600102	\N	31	126	\N
22	17/1 Plot No 948-A 13th Main Road H Block Anna Nagar	Chennai	Ortho Inde Hospital	reachus@orthoindehospital.in	+91-9840079008	600040	\N	31	127	\N
23	1 Thiruvalluvar Salai Kongu Nagar Mogappair East	Chennai	Dr Vijays Hospital	drvijayshospital1@gmail.com	+91-9840731328	600037	\N	31	128	\N
24	Velachery Bypass Rd Velachery	Chennai	Olive Tours & Travels	bookings@oliveltours.com	8122121311	600042	\N	32	129	\N
25	2nd Main Road Raghava Nagar Moovarasampet	Chennai	Chennai Travels	contact@chennaitravels.in	7550078781	600091	\N	32	130	\N
26	Chennai - 600094	Chennai	AK Travel Services	aktravelss@gmail.com	04448599566	600094	\N	32	131	\N
27	Anna Nagar 3rd Main Rd Block E Annanagar East	Chennai	Anna Nagar Auto Service	info@annanagarautoservice.com		600102	\N	33	132	\N
28	Anna Nagar Chennai	Chennai	GoMechanic Anna Nagar	support@gomechanic.in		600040	\N	33	133	\N
29	Chennai (various locations)	Chennai	HomeTriangle Services	info@hometriangle.com		600001	\N	34	134	\N
30	W Block Sector C Anna Nagar West	Chennai	M Tutor	info@m-tutor.com	8754548383	600101	\N	35	135	\N
31	Chennai (home visits)	Chennai	Perfect Tutor	info@perfecttutor.in		600001	\N	35	136	\N
32	Chennai (doorstep)	Chennai	Alwayscool AC Services	support@alwayscool.in	9884699911	600001	\N	36	137	\N
33	Chennai (various)	Chennai	HomeTriangle Plumbers	info@hometriangle.com		600001	\N	37	134	\N
34	Chennai (doorstep)	Chennai	Fast Help Plumbing	info@fasthelp.in		600001	\N	37	139	\N
35	Chennai	Chennai	ServiceTree Plumbing	info@servicetree.in	04440114081	600001	\N	37	138	\N
36	Chennai (various)	Chennai	HomeTriangle Electric	info@hometriangle.com		600001	\N	38	134	\N
37	Chennai (doorstep)	Chennai	Fast Help Electrical	info@fasthelp.in		600001	\N	38	139	\N
38	Chennai (various)	Chennai	HomeTriangle Cleaning	info@hometriangle.com		600001	\N	39	134	\N
39	Chennai (doorstep)	Chennai	Fast Help Cleaning	info@fasthelp.in		600001	\N	39	139	\N
40	Anna Nagar Chennai	Chennai	GoMechanic Car Service	support@gomechanic.in		600040	\N	40	133	\N
41	Anna Nagar 3rd Main Rd	Chennai	Anna Nagar Car Service	info@annanagarautoservice.com		600102	\N	40	132	\N
2	Rmz,mugalivakkam	Chennai	PROPEL	reachout@propelinc.com	09134567801	600016	\N	1	5	\N
45	ws	Chennai	zayn hair dressers	champak@gmail.com	9876543210	600016	\N	43	5	\N
46		Chennai	Max Car service	k.syed200367@gmail.com	1231231231	600016	\N	40	5	\N
\.


--
-- Data for Name: services_keywords; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services_keywords (services_id, keywords) FROM stdin;
3	movers
3	parcel 
3	packers
3	alandur
3	chennai
3	selvam packers and movers
14	homemade
14	delivery
14	tiffin
14	veg
14	non-veg
15	vegetarian
15	lunch
15	dinner
15	subscription
15	south-indian
16	home-delivery
16	authentic
16	meals
16	chennai
16	healthy
17	homecooked
17	lunch
17	snacks
17	biryani
17	veg
18	tiffin
18	subscription
18	bachelors
18	healthy
18	homemade
19	general
19	consultation
19	emergency
19	hospital
19	anna-nagar
20	speciality
20	physician
20	anna-nagar
20	healthcare
20	clinic
21	multispeciality
21	doctors
21	anna-nagar
21	emergency
21	consultation
22	ortho
22	doctors
22	surgery
22	anna-nagar
22	consultation
23	general
23	medicine
23	mogappair
23	hospital
23	doctors
24	travel
24	trip
24	vacation
24	journey
24	adventure
24	tour
25	travel
25	trip
25	vacation
25	journey
25	adventure
25	tour
26	travel
26	trip
26	vacation
26	journey
26	adventure
26	tour
27	car
27	auto
27	vehicle
27	repair
27	maintenance
27	service
28	car
28	auto
28	vehicle
28	repair
28	maintenance
28	service
29	home
29	repair
29	maintenance
29	plumbing
29	electric
29	house cleaning
29	fix
30	education
30	tutoring
30	learning
30	teaching
30	lessons
30	classes
31	education
31	tutoring
31	learning
31	teaching
31	lessons
31	classes
32	AC
32	air conditioning
32	cooling
32	temperature
32	repair
32	service
33	plumbing
33	pipe
33	leak
33	water
33	repair
33	maintenance
34	plumbing
34	pipe
34	leak
34	water
34	repair
34	maintenance
35	plumbing
35	pipe
35	leak
35	water
35	repair
35	maintenance
36	electrical
36	wiring
36	electric
36	power
36	installation
36	repair
37	electrical
37	wiring
37	electric
37	power
37	installation
37	repair
38	cleaning
38	house
38	home
38	wash
38	dust
38	tidy
39	cleaning
39	house
39	home
39	wash
39	dust
39	tidy
40	car
40	vehicle
40	auto
40	service
40	repair
40	maintenance
41	car
41	vehicle
41	auto
41	service
41	repair
41	maintenance
42	moving
42	relocation
42	packers
42	movers
3	Packers and Movers
42	transport
42	shift
43	moving
43	relocation
43	packers
43	movers
43	transport
43	shift
3	Packers & Movers
45	dressers
45	hair
45	hair stylist
45	zayn
45	hair salon
45	salon
46	repair
46	auto
46	max
46	car
46	service
46	maintenance
46	car service
46	vehicle
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_id, role_id) FROM stdin;
6	1
5	1
142	2
119	3
120	3
121	3
122	3
123	3
124	3
125	3
126	3
127	3
128	3
129	3
130	3
131	3
132	3
133	3
134	3
135	3
136	3
137	3
138	3
139	3
1	3
5	3
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, name, password, phone, is_verified) FROM stdin;
119	tiffitprovider@tiffit.com	Tiffit Provider	$2a$10$UiT28fw2F5C6zEhRmPYQ1.18IPxvMxvQ2QBKzJzhlterL4g6okLqC	04412345678	f
120	vadumangaiprovider@vadumangai.com	Vadumangai Provider	$2a$10$YmnNZSPu3pjQx1CvHJYGBeAZCz/4Z8O1EQLcy9XhbE.PAhsZ/atji	09840012345	f
121	maavaduprovider@maavadu.in	Maavadu Provider	$2a$10$liUjXgk8FHU8/dezsQxlq.V6eoi0hgDgSjCg5czQUhQY3YNYltzJ6	04428512345	f
122	dhiviprovider@dhivikitchen.com	Dhivi Kitchen Provider	$2a$10$pDjYMSdurHw17tF.yCgqQeoHyNXDNDaP/kQu1dM4bIR8k3fbvM422	09841234567	f
123	dailyboxprovider@dailybox.co.in	DailyBox Provider	$2a$10$LQWg7A7/iYybiGVYIux5gOyNZDQkI/ppv/b6dfkRo31mishmXnXPO	04440012345	f
124	info@selvarangamhospital.com	Selvarangam Admin	$2a$10$uee6wJPpUXiWyF8Pxm86s.hjWy.u/fZ9xh2llTtfT8Yxe9nXsDjR2	0442626121	f
125	info@rathimedhospital.com	Rathimed Admin	$2a$10$Gmy0QRXt00KMjAh2OyE0Ze02tGuCX.zeaQOl2xWofjl44K39iZUN.	04426261212	f
126	vihaahospital2017@gmail.com	Vihaa Hospital Admin	$2a$10$.U/1teiATqqWV7nj/KCBmu4JWHxsM/51PJ/R/tatwVaC8vj9FGlMa	09710400000	f
127	reachus@orthoindehospital.in	Ortho Inde Admin	$2a$10$.s/JY1vZAAhLFW8x12IhSe0vPOP/A3DRwXKH8Il76WS..LBjTHljG	09840079008	f
128	drvijayshospital1@gmail.com	Dr Vijay Admin	$2a$10$2dqWHmSxd.sgLTkKvzLuY.01w4viLTwR3w.B6Gu1d44BAzS6206Jq	09840731328	f
129	bookings@oliveltours.com	Olive Tours Admin	$2a$10$VKdcTMSewqFVgK3ri0vUMOcEWnqol/wqdIyUlqK7N3fuZMAOsnL7K	08122121311	f
130	contact@chennaitravels.in	Chennai Travels Admin	$2a$10$mtTEv8t/lhIEd/4xBiEYm.oiBEovUATIy7HgoKgLq7mV52E.mEhC2	07550078781	f
131	aktravelss@gmail.com	AK Travel Admin	$2a$10$4F6gJ3bumuDCLGnYfARz7.VDWg1R/8QJGiYD8QBTGx5c0waTkTyQa	04448599566	f
132	info@annanagarautoservice.com	Anna Nagar Auto Admin	$2a$10$Tv2yQa4RhhZfCVvuVJr3cuJYSY2Qc4i0bD4v5g.MtNfr2UNG.vMge	984567231	f
133	gomechanicprovider@gomechanic.in	GoMechanic Admin	$2a$10$AhZWSgbz3V4drjYxpHyN3OW4fruXDbtIxvYsNeHX7UibFIAlrslSq	904531267	f
134	info@hometriangle.com	HomeTriangle Admin	$2a$10$RCewspyPdj5b3TG1ivCpLO0QMHmBkOcM3y8yF.FLPCVKrwygmLjRG	983524337	f
135	info@m-tutor.com	M Tutor Admin	$2a$10$zJO8b3MBlya1/cFKc01Npu.YACsyAlvJcklBHVWlqera0oHMFs4qC	08754548384	f
136	info@perfecttutor.in	Perfect Tutor Admin	$2a$10$r4sO9r3F/1Tw0CczC6cxP.ICJ4/UMRckKtoZ11qtJjK/pp0kLk1QK		f
137	9884699911@alwayscool.in	Alwayscool Admin	$2a$10$eSCbegVPbzWGhE4HN465cOWshyphnTM1cj7KfFGqQAlpEJxsZQ216	09884699911	f
138	info@servicetree.in	ServiceTree Admin	$2a$10$nlOXnMqelfsLwuW6fd9t.uXlDNKXzNd5.uG9v7kWAWyIPzPqh5vpG	504440114081	f
139	info@fasthelp.in	Fast Help Admin	$2a$10$jtSPvvDt5rytvnySJ2JM3.TokcwP2No.0KRJZpw41mqbo9poSYYsu	212453689	f
1	jindallah@gmail.com	khabib	$2a$10$SafEyiIZHEClrHUgARKt2OYxK34ec4tf6jDPB97MoOpHdh6JYtI9.	1	f
6	islammakachev@admin.edu	Syed	$2a$10$pgHJuNopN.xV5uFxM0OJtOXMEIm5CW4a7NB6XlDAFWbIfxI92rQP6	3	f
142	k.syed200367@gmail.com	Syed	$2a$10$hj0skJDk/xVA.eSY15t1GOw540oINC5FuuuIwXJUO48pd6rDFM01a	9444990738	t
5	syedab@gmail.com	Zayn	$2a$10$SafEyiIZHEClrHUgARKt2OYxK34ec4tf6jDPB97MoOpHdh6JYtI9.	9876543221	t
\.


--
-- Name: booking_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.booking_details_id_seq', 26, true);


--
-- Name: buisness_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.buisness_category_id_seq', 43, true);


--
-- Name: email_verification_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.email_verification_tokens_id_seq', 21, true);


--
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favorites_id_seq', 7, true);


--
-- Name: notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_id_seq', 65, true);


--
-- Name: refresh_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refresh_token_id_seq', 321, true);


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_id_seq', 2, true);


--
-- Name: service_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_images_id_seq', 3, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.services_id_seq', 46, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 144, true);


--
-- Name: booking_details booking_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_details
    ADD CONSTRAINT booking_details_pkey PRIMARY KEY (id);


--
-- Name: buisness_category buisness_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buisness_category
    ADD CONSTRAINT buisness_category_pkey PRIMARY KEY (id);


--
-- Name: email_verification_tokens email_verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: flyway_schema_history flyway_schema_history_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: refresh_token refresh_token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT refresh_token_pkey PRIMARY KEY (id);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: service_images service_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_images
    ADD CONSTRAINT service_images_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: favorites uk6f5oswtjo2paky1ggs2gp1g21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT uk6f5oswtjo2paky1ggs2gp1g21 UNIQUE (user_id, service_id);


--
-- Name: users uk_6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: users uk_du5v5sr43g5bfnji4vb8hg5s3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_du5v5sr43g5bfnji4vb8hg5s3 UNIQUE (phone);


--
-- Name: email_verification_tokens uk_ewmvysc7e9y6uy7og2c21axa9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT uk_ewmvysc7e9y6uy7og2c21axa9 UNIQUE (token);


--
-- Name: email_verification_tokens uk_s3mje1c85ftmp2uld6dt1bffs; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT uk_s3mje1c85ftmp2uld6dt1bffs UNIQUE (user_id);


--
-- Name: services uklodbps7bie6tas69gt98he0vw; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT uklodbps7bie6tas69gt98he0vw UNIQUE (service_provider_id, company_name);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: flyway_schema_history_s_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX flyway_schema_history_s_idx ON public.flyway_schema_history USING btree (success);


--
-- Name: idx_booking_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_booking_customer_id ON public.booking_details USING btree (customer_id);


--
-- Name: idx_booking_service_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_booking_service_provider_id ON public.booking_details USING btree (service_provider_id);


--
-- Name: idx_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_id ON public.users USING btree (id);


--
-- Name: services_keywords fk1957y6rr472hhmwjsjg293m8h; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services_keywords
    ADD CONSTRAINT fk1957y6rr472hhmwjsjg293m8h FOREIGN KEY (services_id) REFERENCES public.services(id);


--
-- Name: favorites fk1v3ktgfy1uy6qqkdvs6ee9bqu; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fk1v3ktgfy1uy6qqkdvs6ee9bqu FOREIGN KEY (service_id) REFERENCES public.services(id);


--
-- Name: services fk5kj8pt1vqcw1wtksbux1p5u56; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT fk5kj8pt1vqcw1wtksbux1p5u56 FOREIGN KEY (service_provider_id) REFERENCES public.users(id);


--
-- Name: services fkb4a2hbostvxq2xgbix8lc67bj; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT fkb4a2hbostvxq2xgbix8lc67bj FOREIGN KEY (business_category_id) REFERENCES public.buisness_category(id);


--
-- Name: booking_details fki61h9unx7dsc9woog2e0jdp4d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_details
    ADD CONSTRAINT fki61h9unx7dsc9woog2e0jdp4d FOREIGN KEY (service_id) REFERENCES public.services(id);


--
-- Name: service_images fkico1fuyxgk2m2tfqt12tj4kh2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_images
    ADD CONSTRAINT fkico1fuyxgk2m2tfqt12tj4kh2 FOREIGN KEY (service_id) REFERENCES public.services(id);


--
-- Name: favorites fkk7du8b8ewipawnnpg76d55fus; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT fkk7du8b8ewipawnnpg76d55fus FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: buisness_category_keywords fkkbif5gw2an19nw3145onsh8d0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buisness_category_keywords
    ADD CONSTRAINT fkkbif5gw2an19nw3145onsh8d0 FOREIGN KEY (buisness_category_id) REFERENCES public.buisness_category(id);


--
-- Name: booking_details fkpmviqgig94qgyhrbh5x74kwsi; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_details
    ADD CONSTRAINT fkpmviqgig94qgyhrbh5x74kwsi FOREIGN KEY (customer_id) REFERENCES public.users(id);


--
-- Name: user_roles fkrhfovtciq1l558cw6udg0h0d3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT fkrhfovtciq1l558cw6udg0h0d3 FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- Name: booking_details fksg5094ekydcy87ew6114opaf2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_details
    ADD CONSTRAINT fksg5094ekydcy87ew6114opaf2 FOREIGN KEY (service_provider_id) REFERENCES public.users(id);


--
-- Name: user_roles user_roles_mapping; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_mapping FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: email_verification_tokens user_token_mapping; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT user_token_mapping FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict LltzBJngfpEg1XEtRQ7FnStf1xcBWZ88r2QpjJAIO6hi2wbYF10vejONQ2uxZyq

