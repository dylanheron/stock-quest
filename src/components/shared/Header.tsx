"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  MenuItem,
  Popover,
  ThemeProvider,
  Toolbar,
  Typography
} from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { theme } from "./theme";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  let timeoutId: NodeJS.Timeout | null = null;

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      setOpen(true);
    }, 100);
  };

  const handlePopoverClose = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      setOpen(false);
    }, 100);
  };

  const handlePopoverEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar className="bg-neutral-800" position="static" elevation={0}>
        <Toolbar>
          <Link href="/">
            <Typography
              className="mr-2 font-bold text-[#2AB4E3]"
              variant="h6"
              noWrap
            >
              Stock Quest
            </Typography>
          </Link>
          <Box className="flex-grow flex">
            <MenuItem
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <Typography textAlign="center">Learn</Typography>
            </MenuItem>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              onMouseEnter={handlePopoverEnter}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center"
              }}
            >
              <Link href="/learn/quiz">
                <MenuItem>
                  <Typography textAlign="center" sx={{ color: "black" }}>
                    Quiz
                  </Typography>
                </MenuItem>
              </Link>
              <Link href="/learn/resources">
                <MenuItem>
                  <Typography textAlign="center" sx={{ color: "black" }}>
                    Resources
                  </Typography>
                </MenuItem>
              </Link>
            </Popover>
            <MenuItem>
              <Link href="/statistics">
                <Typography textAlign="center">Statistics</Typography>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link href="/game">
                <Typography textAlign="center">Play</Typography>
              </Link>
            </MenuItem>
          </Box>
          <Box className="flex-1" />
          <Box className="flex-0">
            <SignedOut>
              <SignInButton>
                <button className="text-white font-bold">Sign In</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Box>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}
