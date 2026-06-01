import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TrustBadge } from "../TrustBadge";
import * as explorerUtils from "@/lib/explorer";

// Mock the clipboard API
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe("TrustBadge", () => {
  const contractAddress = "CA4HA7X3Y2P3KVZP3R6J3R6J3R6J3R6J3R6J3R6J3R6J3R6J3R6J3R6J";
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the trust copy and shield icon", () => {
    render(<TrustBadge contractAddress={contractAddress} />);
    
    expect(screen.getByText("Funds Protected by Smart Contract")).toBeInTheDocument();
    expect(screen.getByText("Escrow contract automatically handles release")).toBeInTheDocument();
  });

  it("renders the truncated contract address", () => {
    render(<TrustBadge contractAddress={contractAddress} />);
    
    // Default truncation is 4 start, 4 end
    const expectedTruncation = "CA4H...3R6J";
    expect(screen.getByText(expectedTruncation)).toBeInTheDocument();
  });

  it("calls navigator.clipboard.writeText on copy button click", async () => {
    render(<TrustBadge contractAddress={contractAddress} />);
    
    const copyButton = screen.getByLabelText("Copy address");
    fireEvent.click(copyButton);
    
    expect(mockWriteText).toHaveBeenCalledWith(contractAddress);
    expect(mockWriteText).toHaveBeenCalledTimes(1);
  });

  it("renders the correct Stellar Expert URL based on explorer.ts", () => {
    const mockUrl = "https://testnet.stellarexpert.io/contract/mock";
    vi.spyOn(explorerUtils, "getStellarExpertUrl").mockReturnValue(mockUrl);
    
    render(<TrustBadge contractAddress={contractAddress} />);
    
    const link = screen.getByLabelText("View on Stellar Expert");
    expect(link).toHaveAttribute("href", mockUrl);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("is responsive with standard mobile flex layout classes", () => {
    render(<TrustBadge contractAddress={contractAddress} />);
    
    // Check main container
    const container = screen.getByText("Funds Protected by Smart Contract").closest('div.flex.w-full.flex-col.sm\\:flex-row');
    expect(container).toBeInTheDocument();
  });
});
