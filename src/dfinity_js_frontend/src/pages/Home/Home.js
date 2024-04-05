import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Images from "../../assets/images";
import { CloseSVG } from "../../assets/images";
import { Img } from "../../components/Img";
import { Text } from "../../components/Text";
import { SelectBox } from "../../components/SelectBox";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Heading } from "../../components/Heading";

const dropDownOptions = [
  { label: "Option1", value: "option1" },
  { label: "Option2", value: "option2" },
  { label: "Option3", value: "option3" },
];

export default function HomeJobListingPage() {
  const [searchBarValue2, setSearchBarValue2] = React.useState("");

  return (
    <>
      <Helmet>
        <title>Farm Work Flow</title>
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
      </Helmet>
      <div className="w-full bg-white-A700 shadow-xs">
        <header className="flex items-center justify-center rounded bg-white-A700 p-2.5">
          <div className="mx-auto flex w-full max-w-[1341px] justify-center">
            <div className="flex w-full items-center justify-between gap-5">
              <Img
                src={Images.img_image_19}
                alt="imagenineteen"
                className="h-[44px] w-[9%]"
              />
              <div className="flex items-center gap-2">
                <Img
                  src={Images.img_bell_2}
                  alt="bell"
                  className="h-[30px] w-[30px]"
                />
                <span className="text-[16px] leading-[19px]">
                  +1-234-567-890
                </span>
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-[30px] self-stretch bg-light_blue-50 p-[53px] md:flex-col md:p-5">
            <div className="flex w-[44%] flex-col items-start gap-[17px] md:w-full">
              <Heading
                size="4xl"
                as="h1"
                className="!font-epilogue !text-cyan-500"
              >
                <span className="text-cyan-500">1</span>
                <span className="text-cyan-500">0</span>
                <span className="text-cyan-500">,</span>
                <span className="text-cyan-500">00</span>
                <span className="text-cyan-500">0</span>
                <span className="text-cyan-500">+</span>
                <span className="text-cyan-500">&nbsp;Jobs&nbsp;</span>
                <span className="text-blue_gray-900">
                  Tailored For You &nbsp;
                </span>
              </Heading>
              <Text size="md" as="p" className="leading-[22px] !text-gray-700">
                FarmWorkChain simplifies finding and filling agricultural roles.
                Our blockchain-based platform ensures fairness and security,
                bridging the gap between farmers and workers effectively.
              </Text>
              <Button
                size="4xl"
                shape="round"
                className="min-w-[192px] shadow-sm sm:px-5"
              >
                Explore now
              </Button>
            </div>
            <div className="relative h-[406px] flex-1 bg-light_blue-50 py-[18px] pl-[18px] md:h-auto md:w-full md:flex-none md:self-stretch md:p-5">
              <div className="flex w-[93%] flex-col items-end">
                <div className="flex flex-col items-start self-stretch">
                  <div className="relative z-[2] ml-[75px] w-[22%] rounded-[56px] bg-cyan-100 md:ml-0 md:w-full">
                    <Img
                      src={Images.img_rectangle}
                      alt="circleimage"
                      className="h-[112px] w-[112px] rounded-[50%]"
                    />
                  </div>
                  <div className="relative mt-[-45px] h-[244px] self-stretch rounded-[122px] bg-cyan-500 p-[17px] shadow-md">
                    <div className="absolute bottom-[14%] left-[13%] m-auto flex w-[58%] items-center justify-center gap-6 rounded-lg bg-white-A700 p-[38px] shadow-lg sm:p-5">
                      <Img
                        src={Images.img_image_3}
                        alt="imagethree_one"
                        className="h-[51px] w-[52px]"
                      />
                      <div className="flex flex-col items-start gap-[3px]">
                        <Heading size="lg" as="h2">
                          Farm Manager
                        </Heading>
                        <Heading size="md" as="h3" className="!text-cyan-500">
                          $120K - $130K
                        </Heading>
                      </div>
                    </div>
                    <div className="absolute right-[6%] top-[17.00px] m-auto flex w-[46%] items-center justify-center gap-[19px] rounded-lg bg-white-A700 p-[22px] shadow-xl sm:p-5">
                      <Img
                        src={Images.img_image_4}
                        alt="imagefour_one"
                        className="h-[38px] w-[31%]"
                      />
                      <div className="my-3 flex flex-col items-start gap-[5px]">
                        <Heading size="md" as="h4">
                          Pigsty Cleaner
                        </Heading>
                        <Heading as="h5" className="!text-cyan-500">
                          $100K - $110K
                        </Heading>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative z-[1] mr-[21px] mt-[-42px] w-[15%] rounded-[42px] bg-deep_orange-100 md:mr-0 md:w-full">
                  <Img
                    src={Images.img_rectangle_84x84}
                    alt="circleimage_one"
                    className="h-[84px] w-[84px] rounded-[50%]"
                  />
                </div>
              </div>
              <Img
                src={Images.img_close}
                alt="close_one"
                className="absolute right-[11.00px] top-[18%] m-auto h-[52px] w-[52px] rounded-[50%]"
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-[65px] self-stretch bg-white-A700 px-14 py-[82px] md:p-5 sm:gap-8">
            <Heading
              size="4xl"
              as="h2"
              className="mt-[9px] text-center !font-epilogue"
            >
              <span className="text-blue_gray-900">Explore more</span>
              <span className="text-cyan-500">&nbsp;jobs</span>
            </Heading>
            <div className="flex w-[58%] items-center md:w-full md:flex-col">
              <Input
                size="lg"
                name="search"
                placeholder={`Search for jobs...`}
                value={searchBarValue2}
                onChange={(e) => setSearchBarValue2(e)}
                prefix={
                  <Img
                    src={Images.img_search}
                    alt="Search"
                    className="h-[24px] w-[24px] cursor-pointer"
                  />
                }
                suffix={
                  searchBarValue2?.length > 0 ? (
                    <CloseSVG
                      onClick={() => setSearchBarValue2("")}
                      height={24}
                      width={24}
                      fillColor="#171a1fff"
                    />
                  ) : null
                }
                className="flex-grow gap-2 rounded-bl-md rounded-tl-md !text-blue_gray-200 sm:pr-5"
              />
              <SelectBox
                size="lg"
                shape="square"
                indicator={
                  <Img
                    src={Images.img_arrowdown}
                    alt="arrow_down"
                    className="h-[18px] w-[18px]"
                  />
                }
                name="location"
                placeholder={`Location`}
                options={dropDownOptions}
                className="w-[25%] gap-px md:w-full sm:pr-5"
              />
              <Button
                size="4xl"
                className="min-w-[121px] rounded-br-md rounded-tr-md sm:px-5"
              >
                Search
              </Button>
            </div>
            <div className="mx-auto flex w-full max-w-[1173px] items-center gap-10 md:flex-col">
              <Button
                color="gray_100"
                size="3xl"
                shape="circle"
                className="w-[44px] !rounded-[22px]"
              >
                <Img src={Images.img_arrow_left} />
              </Button>
              <div className="flex flex-1 gap-[47px] md:flex-col md:self-stretch">
                <div className="flex w-full flex-col items-center rounded-lg bg-light_blue-50 p-[33px] sm:p-5">
                  <Img
                    src="images/img_container_14.svg"
                    alt="aquaculture_one"
                    className="h-[65px] w-[65px] rounded-[50%]"
                  />
                  <Heading
                    size="xl"
                    as="h3"
                    className="mt-[18px] text-center !font-epilogue"
                  >
                    Aquaculture
                  </Heading>
                  <Text
                    as="p"
                    className="mb-[15px] mt-[9px] text-center !text-blue_gray-900"
                  >
                    1237 jobs
                  </Text>
                </div>
                <div className="flex w-full flex-col items-center rounded-lg bg-gray-100_01 p-[33px] sm:p-5">
                  <Img
                    src={Images.img_container_16}
                    alt="containersixtee"
                    className="h-[65px] w-[65px] rounded-[50%]"
                  />
                  <Heading
                    size="xl"
                    as="h4"
                    className="mt-[19px] text-center !font-epilogue"
                  >
                    Dairy Farm
                  </Heading>
                  <Text
                    as="p"
                    className="mb-[15px] mt-[9px] text-center !text-blue_gray-900"
                  >
                    3546 jobs
                  </Text>
                </div>
                <div className="flex w-full flex-col items-center rounded-lg bg-gray-100_02 p-[33px] sm:p-5">
                  <Img
                    src={Images.img_floating_icon}
                    alt="floatingicon"
                    className="h-[65px] w-[65px] rounded-[50%]"
                  />
                  <Heading
                    size="xl"
                    as="h5"
                    className="mt-[18px] text-center !font-epilogue"
                  >
                    Poultry Farm
                  </Heading>
                  <Text
                    as="p"
                    className="mb-[15px] mt-[9px] text-center !text-blue_gray-900"
                  >
                    5768 jobs
                  </Text>
                </div>
                <div className="flex w-full flex-col items-center rounded-lg bg-gray-100_03 p-[33px] sm:p-5">
                  <Img
                    src={Images.img_container_20}
                    alt="containertwenty"
                    className="h-[65px] w-[65px] rounded-[50%]"
                  />
                  <Heading
                    size="xl"
                    as="h6"
                    className="mt-[18px] text-center !font-epilogue"
                  >
                    Hydroponics
                  </Heading>
                  <Text
                    as="p"
                    className="mb-[15px] mt-[9px] text-center !text-blue_gray-900"
                  >
                    2473 jobs
                  </Text>
                </div>
              </div>
              <Button
                color="gray_100"
                size="3xl"
                shape="circle"
                className="w-[44px] !rounded-[22px]"
              >
                <Img src={Images.img_arrow_left} />
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center self-stretch bg-white-A700 px-14 py-24 md:p-5">
            <Heading
              size="4xl"
              as="h2"
              className="mt-2 text-center !font-epilogue !text-cyan-500"
            >
              Latest jobs
            </Heading>
            <Text size="xl" as="p" className="mt-5 text-center">
              Exercitation dolore reprehenderit fugi
            </Text>
            <div className="mx-auto mt-[54px] grid w-full max-w-[1183px] grid-cols-[repeat(auto-fill,_minmax(337px_,_1fr))] justify-center gap-[22px]">
              <div className="flex w-full flex-col rounded-lg border border-solid border-gray-100 bg-white-A700 p-5">
                <div className="ml-[5px] mt-1 flex items-center gap-[23px] md:ml-0">
                  <Img
                    src={Images.img_close_teal_a400}
                    alt="beekeeper_one"
                    className="h-[52px] w-[52px]"
                  />
                  <div className="flex flex-1 flex-col items-start gap-[3px]">
                    <div className="flex items-center justify-between gap-5 self-stretch">
                      <Heading size="lg" as="h3" className="self-end">
                        Beekeeper
                      </Heading>
                    </div>
                    <Text as="p" className="!text-gray-900">
                      $95K - $120K
                    </Text>
                  </div>
                </div>
                <div className="ml-[5px] mt-6 flex gap-[15px] md:ml-0">
                  <Img
                    src={Images.img_home}
                    alt="rift_valley_one"
                    className="h-[20px] w-[20px] self-start"
                  />
                  <Text as="p" className="self-end">
                    Rift Valley
                  </Text>
                </div>
                <div className="ml-[5px] mt-[11px] flex gap-[15px] md:ml-0">
                  <Img
                    src={Images.img_pin_3_1}
                    alt="tucsonaz_one"
                    className="h-[20px] w-[20px] self-start"
                  />
                  <Text as="p" className="self-end">
                    <span className="text-gray-500">Tucson, A</span>
                    <span className="text-gray-500">Z</span>
                  </Text>
                </div>
                <div className="mb-4 ml-[5px] mt-[11px] flex w-[30%] justify-between gap-5 md:ml-0 md:w-full">
                  <Img
                    src={Images.img_bookmark_1}
                    alt="onsite_one"
                    className="h-[20px] w-[20px]"
                  />
                  <Text as="p">Onsite</Text>
                </div>
              </div>
              <div className="flex w-full flex-col items-start rounded-lg border border-solid border-gray-100 bg-white-A700 p-6 sm:p-5">
                <div className="flex w-[86%] items-center gap-6 md:w-full">
                  <Img
                    src={Images.img_close_orange_300}
                    alt="close_one"
                    className="h-[52px] w-[52px]"
                  />
                  <div className="flex flex-col items-start gap-1 self-end">
                    <Heading size="lg" as="h4">
                      Agricultural Technician
                    </Heading>
                    <Text as="p" className="!text-gray-900">
                      $110K - $120K
                    </Text>
                  </div>
                </div>
                <div className="mt-6 flex gap-4">
                  <Img
                    src={Images.img_home}
                    alt="home_one"
                    className="h-[20px] w-[20px]"
                  />
                  <Text as="p">Kapsabet</Text>
                </div>
                <div className="mt-3 flex gap-4">
                  <Img
                    src={Images.img_pin_3_1}
                    alt="pin3two_one"
                    className="h-[20px] w-[20px] self-start"
                  />
                  <Text as="p" className="self-end">
                    Columbus, OH
                  </Text>
                </div>
                <div className="my-[11px] flex gap-4">
                  <Img
                    src={Images.img_bookmark_1}
                    alt="bookmarktwo_one"
                    className="h-[20px] w-[20px] self-start"
                  />
                  <Text as="p" className="self-end">
                    Hybrid
                  </Text>
                </div>
              </div>
              <div className="flex w-full flex-col items-start gap-[11px] rounded-lg border border-solid border-gray-100 bg-white-A700 p-6 sm:p-5">
                <div className="flex w-[85%] items-start justify-between gap-5 md:w-full">
                  <div className="flex w-[24%] flex-col items-start gap-6">
                    <Img
                      src={Images.img_image_11}
                      alt="imageeleven_one"
                      className="h-[52px] w-[52px]"
                    />
                    <div className="flex gap-4">
                      <Img
                        src={Images.img_home}
                        alt="home_one"
                        className="h-[20px] w-[20px] self-start"
                      />
                      <Text as="p" className="self-end">
                        Eldoret
                      </Text>
                    </div>
                  </div>
                  <div className="mt-[3px] flex flex-col items-start gap-1.5">
                    <Heading size="lg" as="h5">
                      Horticultural Assistants
                    </Heading>
                    <Text as="p" className="!text-gray-900">
                      $110K - $120K
                    </Text>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Img
                    src={Images.img_pin_3_1}
                    alt="pin3three_one"
                    className="h-[20px] w-[20px] self-start"
                  />
                  <Text as="p" className="self-end">
                    Tulsa, OK
                  </Text>
                </div>
                <div className="mb-3 flex w-[33%] justify-between gap-5 md:w-full">
                  <Img
                    src={Images.img_bookmark_1}
                    alt="bookmarkthree"
                    className="h-[20px] w-[20px]"
                  />
                  <Text as="p">Remote</Text>
                </div>
              </div>
              <div className="flex w-full flex-col items-start rounded-lg border border-solid border-gray-100 bg-white-A700 p-[25px] sm:p-5">
                <div className="flex w-[68%] items-center gap-6 md:w-full">
                  <Img
                    src={Images.img_image_13}
                    alt="imagethirteen"
                    className="h-[52px] w-[52px]"
                  />
                  <div className="flex flex-col items-start gap-[5px]">
                    <Heading size="lg" as="h6">
                      Casual Labourer
                    </Heading>
                    <Text as="p" className="!text-gray-900">
                      $95K - $120K
                    </Text>
                  </div>
                </div>
                <div className="mt-[22px] flex gap-4">
                  <Img
                    src={Images.img_home}
                    alt="home_one"
                    className="h-[20px] w-[20px]"
                  />
                  <Text as="p">Meru</Text>
                </div>
                <div className="mt-3 flex gap-4">
                  <Img
                    src={Images.img_pin_3_1}
                    alt="pin3five_one"
                    className="h-[20px] w-[20px] self-start"
                  />
                  <Text as="p" className="self-end">
                    Santa Ana, CA
                  </Text>
                </div>
                <div className="my-[11px] flex w-[31%] justify-between gap-5 md:w-full">
                  <Img
                    src={Images.img_bookmark_1}
                    alt="bookmarkfive"
                    className="h-[20px] w-[20px]"
                  />
                  <Text as="p">Onsite</Text>
                </div>
              </div>
              <div className="flex w-full flex-col rounded-lg border border-solid border-gray-100 bg-white-A700 p-5">
                <div className="ml-[3px] mt-1.5 flex items-center gap-[26px] md:ml-0">
                  <Img
                    src={Images.img_image_14}
                    alt="imagefourteen"
                    className="h-[52px] w-[52px]"
                  />
                  <div className="flex flex-1 flex-col items-start gap-[5px] self-start">
                    <div className="flex items-center justify-between gap-5 self-stretch">
                      <Heading size="lg" as="h6">
                        Herdsman
                      </Heading>
                      <Button
                        color="gray_100_01"
                        size="xs"
                        shape="round"
                        className="min-w-[35px]"
                      >
                        Hot
                      </Button>
                    </div>
                    <Text as="p" className="!text-gray-900">
                      $130K - $140
                    </Text>
                  </div>
                </div>
                <div className="ml-[5px] mt-[22px] flex gap-4 md:ml-0">
                  <Img
                    src={Images.img_home}
                    alt="home_one"
                    className="h-[20px] w-[20px]"
                  />
                  <Text as="p">Laboru</Text>
                </div>
                <div className="ml-[5px] mt-3 flex gap-4 md:ml-0">
                  <Img
                    src={Images.img_pin_3_1}
                    alt="pin3six_one"
                    className="h-[20px] w-[20px] self-start"
                  />
                  <Text as="p" className="self-end">
                    Austin, TX
                  </Text>
                </div>
                <div className="mb-[15px] ml-[5px] mt-[11px] flex gap-4 md:ml-0">
                  <Img
                    src={Images.img_bookmark_1}
                    alt="bookmarksix_one"
                    className="h-[20px] w-[20px] self-start"
                  />
                  <Text as="p" className="self-end">
                    Long-term
                  </Text>
                </div>
              </div>
              <div className="flex w-full flex-col items-start rounded-lg border border-solid border-gray-100 bg-white-A700 p-[25px] sm:p-5">
                <div className="flex w-[61%] items-center gap-6 md:w-full">
                  <Img
                    src={Images.img_image_12}
                    alt="imagetwelve_one"
                    className="h-[52px] w-[52px]"
                  />
                  <div className="flex flex-col items-start gap-[3px]">
                    <Heading size="lg" as="h6">
                      Farm Manager
                    </Heading>
                    <Text as="p" className="!text-gray-900">
                      $110K - $120K
                    </Text>
                  </div>
                </div>
                <div className="mt-[22px] flex gap-4">
                  <Img
                    src={Images.img_home}
                    alt="home_one"
                    className="h-[20px] w-[20px]"
                  />
                  <Text as="p">Trans Nzoi</Text>
                </div>
                <div className="mt-3 flex gap-4">
                  <Img
                    src={Images.img_pin_3_1}
                    alt="pin3four_one"
                    className="h-[20px] w-[20px] self-start"
                  />
                  <Text as="p" className="self-end">
                    Wichita, KS
                  </Text>
                </div>
                <div className="my-[11px] flex gap-4">
                  <Img
                    src={Images.img_bookmark_1}
                    alt="bookmarkfour"
                    className="h-[20px] w-[20px]"
                  />
                  <Text as="p">Short-term</Text>
                </div>
              </div>
            </div>
            <Button
              size="2xl"
              shape="round"
              className="mt-[52px] min-w-[104px]"
            >
              See more
            </Button>
          </div>
          <div className="mx-auto mt-[62px] flex w-full max-w-[1185px] flex-col items-center justify-center gap-[23px] rounded-[20px] bg-gray-50_01 px-14 py-[92px] md:p-5">
            <Heading
              size="3xl"
              as="h2"
              className="mt-2 text-center !font-epilogue !text-teal-900"
            >
              Who are you
            </Heading>
            <Text size="xl" as="p" className="text-center !text-blue_gray-900">
              Select your role to Sign up
            </Text>
            <div className="w-[75%] flex flex-col justify-center gap-[27px] p-5">
              {/* <!-- Farm Owner Card --> */}
              <div className="flex flex-col items-center bg-light_blue-50 p-[1px] sm:p-5">
                <Img
                  src={Images.img_image_62}
                  alt="Farm Owner Icon"
                  className="h-[50px] w-[50px] rounded-full"
                  style={{ borderRadius: "22px" }}
                />
                <Heading
                  size="xl"
                  as="h3"
                  className="mt-[12px] text-center !font-epilogue"
                >
                  Farm Owner
                </Heading>
                <Text
                  as="p"
                  className="mb-[10px] mt-[6px] text-center !text-blue_gray-900"
                >
                  An employee is a hired individual who works for a company.
                </Text>
                <Link to="/farmer?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai" className="no-underline">
                  <Button
                    color="white_A700"
                    size="lg"
                    className="!rounded-[12px] border border-solid border-cyan-500"
                  >
                    <Img src={Images.img_arrow_right} alt="Right Arrow" />
                  </Button>
                </Link>
              </div>

              {/* <!-- Worker Card --> */}
              <div className="flex flex-col items-center rounded-lg bg-light_blue-50 p-[1px] sm:p-5">
                <Img
                  src={Images.img_image_62}
                  alt="Worker Icon"
                  className="h-[65px] w-[65px] rounded-full"
                />
                <Heading
                  size="xl"
                  as="h3"
                  className="mt-[18px] text-center !font-epilogue"
                >
                  Worker
                </Heading>
                <Text
                  as="p"
                  className="mb-[15px] mt-[9px] text-center !text-blue_gray-900"
                >
                  Independent service provider with a written contract.
                </Text>
                <Link to="/worker?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai" className="no-underline">
                  <Button
                    color="white_A700"
                    size="lg"
                    className="!rounded-[18px] border border-solid border-cyan-500"
                  >
                    <Img src={Images.img_arrow_right} alt="Right Arrow" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}