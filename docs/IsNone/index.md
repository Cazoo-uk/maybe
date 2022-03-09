---
layout: default
title: "IsNone"
has_children: true
has_toc: false
nav_order: 1
---

[@cazoo/maybe](../README.md) / [Exports](../modules.md) / IsNone

# Interface: IsNone

Represents an option that doesn't contain a value.

This interface does expose any functionality. It only exists in order
to allow the compiler to distinguish between `OptionLike<T>` and
`OptionLike<T> & IsNone`.

## Table of contents

### Properties

- [[SomeSymbol]](index.md#[somesymbol])

## Properties

### [SomeSymbol]

• **[SomeSymbol]**: ``false``

Static property. Used to discriminate between `Some` and `None`.

#### Defined in

[src/option/option.ts:571](https://github.com/Cazoo-uk/maybe/blob/40d98a8/src/option/option.ts#L571)
