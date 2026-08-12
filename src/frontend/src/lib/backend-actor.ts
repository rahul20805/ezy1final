import { Actor, HttpAgent } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import type { Product, ProductCategory } from "../types";

// Manual IDL mapping since we don't have dfx generate available
const ProductPublicIDL = IDL.Record({
  id: IDL.Nat,
  vendorId: IDL.Nat,
  name: IDL.Text,
  description: IDL.Text,
  price: IDL.Nat,
  mrp: IDL.Nat,
  images: IDL.Vec(IDL.Text),
  categoryIds: IDL.Vec(IDL.Nat),
  inStock: IDL.Bool,
  stockCount: IDL.Nat,
  isAvailable: IDL.Bool,
});

const ProductCategoryIDL = IDL.Record({
  id: IDL.Nat,
  name: IDL.Text,
  description: IDL.Text,
  image: IDL.Text,
  parentCategoryId: IDL.Opt(IDL.Nat),
});

const BackendInterface = ({ IDL }: { IDL: any }) => {
  return IDL.Service({
    getProducts: IDL.Func([], [IDL.Vec(ProductPublicIDL)], ["query"]),
    getCategories: IDL.Func([], [IDL.Vec(ProductCategoryIDL)], ["query"]),
  });
};

// Hardcoded local replica URL for development
const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });

// Dummy canister ID. In a real scenario, this comes from process.env.CANISTER_ID_BACKEND
const CANISTER_ID = "rrkah-fqaaa-aaaaa-aaaaq-cai";

export const backend = Actor.createActor(BackendInterface, {
  agent,
  canisterId: CANISTER_ID,
});

// Since this is a local development agent, we would typically call fetchRootKey().
// We'll wrap our calls with a helper that ensures the agent is ready.
let isFetched = false;
export async function getBackend() {
  if (!isFetched) {
    try {
      await agent.fetchRootKey();
      isFetched = true;
    } catch (err) {
      console.warn("Unable to fetch root key. Is the local replica running?");
    }
  }
  return backend;
}
