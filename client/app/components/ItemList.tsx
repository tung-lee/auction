"use client";

import styled from "styled-components";
import { Item } from "../@types/Item.type";
import { Dispatch, SetStateAction, useState } from "react";
import Modal from "./Modal";

import { useAppSelector } from "@/context/store";
import {
  selectAccountId,
  selectIsLoading,
  selectWallet,
} from "@/features/walletSlice";
import { useEffect } from "react";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_NAME || "";

const Wrapper = styled.div`
  --section-gap: 42px;
  padding-top: 42px;

  @media (max-width: 1160px) {
    .line-rounded-corners {
      display: none !important;
    }
  }

  @media (max-width: 900px) {
    padding-top: 0;
  }
`;

const H1 = styled.h1`
  font-family: "FK Grotesk", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 90px;
  line-height: 1;
  text-align: center;
  letter-spacing: -0.03em;
  color: #000;
  margin: 0;
  max-width: 700px;

  span {
    display: inline-block;
    background: #6ce89f;
    border-radius: 20px;
    position: relative;
    padding: 0.1em 0.2em 0;

    svg {
      position: absolute;
      bottom: -8px;
      right: -10px;
      width: 24px;
    }
  }

  @media (max-width: 900px) {
    font-size: 50px;

    span {
      border-radius: 12px;
      svg {
        position: absolute;
        bottom: -6px;
        right: -7px;
        width: 16px;
      }
    }
  }
`;

const Flex = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  flex-direction: column;
  flex-wrap: "nowrap";

  @media (max-width: 900px) {
    flex-direction: column;
    gap: var(--section-gap);
  }
`;

const Container = styled.div`
  display: flex;
  max-width: 1060px;
  margin: 0 auto;
  gap: var(--section-gap);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--section-gap) 24px;
`;

const Cards = styled.div`
  display: flex;
  gap: 1.4rem;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 4rem;
`;

const Card = styled.div`
  width: 25%;
  min-width: 250px;
  display: flex;
  flex-flow: column nowrap;
  -ms-flex-flow: column nowrap;
  align-items: center;
  //  background-color:#09011a;
  border-radius: 10px;
  border: 1.41429px solid rgba(28, 27, 28, 0.1);
  box-shadow: 5.65714px 5.65714px 11.3143px rgba(28, 27, 28, 0.04);
  padding: 8px;
  //  color: #fff;
  margin: 0 auto;
  max-width: 400px;
  flex: 1;
  &:hover img {
    transform: scale(1.05);
  }
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
  }
`;

const Hero = styled.div`
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  // background-color:#09011a;
  // color: white;
`;

const CardHeading = styled.h5`
  font-size: 1.25rem;
  font-weght: 500;
  color: #09011a;
`;

const Text = styled.div`
  opacity: 0.6;
`;

const ImageCard = styled.div`
  height: 200px;
  width: 100%;
  border-radius: inherit;
  overflow: hidden;
  margin-bottom: 0.5rem;
  & > img {
    object-fit: cover;
    transition: all 0.3s ease-in-out;
  }
  & > img:hover {
    transform: scale(1.05);
  }
`;

interface ItemListProps {
  items: Item[];
  setItems: Dispatch<SetStateAction<Item[]>>;
}

export default function ItemList(props: ItemListProps) {
  const { items, setItems } = props;
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const wallet = useAppSelector(selectWallet);
  const account = useAppSelector(selectAccountId);
  const [walletReady, setWalletready] = useState(false);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (!isLoading && wallet) {
      setWalletready(true);
    }
  }, [isLoading, wallet]);

  const finishDeleteItem = async (e: any) => {
    if (!wallet) {
      console.error("Wallet is not initialized");
      return;
    }
    setWalletready(false);
    e.preventDefault();

    await wallet
      .callMethod({
        contractId: CONTRACT_ID,
        method: "delete_item",
        args: { item_id: currentItem?.item_id },
        gas: "300000000000000",
      })
      .then(() => setWalletready(true))
      .then(() => setCurrentItem(null))
      .then(() => {
        window.location.reload();
      });
  };

  const startDeleteItem = (itemId: number) => {
    let itemFound = items.find((item) => item.item_id === itemId);
    if (itemFound) {
      setCurrentItem(itemFound);
    }
    setIsShowModal(true);
  };

  return (
    <div className="row" style={{ paddingBottom: "40px" }}>
      <Wrapper>
        <Container>
          <H1>
            Your{" "}
            <span>
              {" "}
              Inventory{" "}
              <svg viewBox="0 0 26 24" fill="none" aria-hidden="true">
                <path
                  d="M24.3767 8.06326L1.51965 0.0649912C1.10402 -0.0830767 0.639031 0.026026 0.327308 0.340346C0.0181841 0.657263 -0.0831256 1.12225 0.0701378 1.53788L8.071 23.2519C8.23726 23.7013 8.66587 24 9.14385 24H9.14644C9.62702 24 10.0556 23.6961 10.2167 23.2441L13.734 13.495L24.3325 10.2349C24.8053 10.0895 25.13 9.65824 25.1378 9.16468C25.1482 8.67112 24.8391 8.22691 24.3715 8.06326H24.3767Z"
                  fill="#323330"
                />
              </svg>
            </span>
          </H1>
        </Container>
      </Wrapper>
      <Cards>
        {items.map((item) => (
          <Card key={item.item_id}>
            <ImageCard>
              <a href="" target="_blank" rel="noopener noreferrer">
                <img src={item.media} alt="..." />
              </a>
            </ImageCard>
            <div className="card-body p-2 mt-3">
              <CardHeading>{item.name}</CardHeading>
              <Text className="ps-2  pb-3 text-secondary">
                {item.description}
              </Text>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Auction
            </button>
            <button
              onClick={() => {
                startDeleteItem(item.item_id);
              }}
              className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </Card>
        ))}
      </Cards>
      <Modal
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
        finishDeleteItem={finishDeleteItem}
      />
    </div>
  );
}
