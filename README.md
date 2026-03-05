# n8n-nodes-beehivehub

This is an n8n community node. It lets you use the [BeehiveHub](https://paybeehive.com.br) payment gateway in your n8n workflows.

BeehiveHub is a payment platform that supports PIX, Boleto and Credit Card transactions. This node allows you to automate payment processing, customer management, transfers, balance queries and payment links directly from n8n.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation) |
[Credentials](#credentials) |
[Operations](#operations) |
[Compatibility](#compatibility) |
[Usage](#usage) |
[Resources](#resources)

---

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

**Via n8n UI (recommended):**

1. Open your n8n instance
2. Go to **Settings > Community Nodes**
3. Select **Install a community node**
4. Enter `n8n-nodes-beehivehub`
5. Confirm the installation

**Via npm (self-hosted):**

```bash
npm install n8n-nodes-beehivehub
```

Then restart your n8n instance.

---

## Credentials

To use this node you need a **BeehiveHub API Secret Key**.

### How to obtain your key

1. Log in to the [BeehiveHub Dashboard](https://conta.paybeehive.com.br)
2. Navigate to your account settings / API Keys section
3. Copy your **Secret Key** (`sk_live_...`)

### Setting up credentials in n8n

1. In n8n, go to **Credentials > New Credential**
2. Search for **BeehiveHub API**
3. Paste your Secret Key
4. Click **Save** — n8n will automatically test the connection

> **Note:** The node uses HTTP Basic Auth under the hood. The secret key is sent as the username and the password is ignored by the API.

---

## Operations

### Transaction

| Operation | Description |
|-----------|-------------|
| **Create** | Create a new transaction (PIX, Boleto or Credit Card) |
| **Get** | Get a transaction by ID |
| **Get Many** | List transactions with filters (status, email, payment method, etc.) |
| **Refund** | Refund a transaction (full or partial) |
| **Update Delivery Status** | Update the delivery status of a transaction (`waiting`, `in_transit`, `delivered`) |

### Customer

| Operation | Description |
|-----------|-------------|
| **Create** | Register a new customer (name, email, CPF/CNPJ, address, phone) |
| **Get** | Get a customer by ID |
| **Get Many** | List customers with optional email filter |

### Transfer

| Operation | Description |
|-----------|-------------|
| **Create** | Create a transfer (bank account or PIX key) |
| **Get** | Get a transfer by ID |

### Balance

| Operation | Description |
|-----------|-------------|
| **Get Available** | Query the available balance (optionally for a specific recipient) |

### Payment Link

| Operation | Description |
|-----------|-------------|
| **Create** | Create a payment link with configurable payment methods, installments and expiration rules |
| **Delete** | Delete a payment link by ID |
| **Get** | Get a payment link by ID |
| **Get Many** | List all payment links |
| **Update** | Update a payment link by ID |

---

## Compatibility

- **Minimum n8n version:** 1.0
- **Node.js:** v22 or higher
- **n8n API version:** 1 (strict mode)

Tested with n8n self-hosted. Should work with n8n Cloud after community node verification.

---

## Usage

### Amounts in cents

All monetary values in the BeehiveHub API are expressed in **centavos** (cents). For example, `R$ 49,90` must be sent as `4990`.

### Payment methods

When creating a transaction, the `paymentMethod` field accepts:

| Value | Description |
|-------|-------------|
| `pix` | Instant PIX payment (Brazilian real-time payment system) |
| `boleto` | Bank slip with configurable expiration |
| `credit_card` | Credit card with installment support (1–12x) |

### AI Tool support

This node is flagged as `usableAsTool`, so it can be used as a tool by n8n AI Agent nodes.

---

## Resources

- [BeehiveHub API Documentation](https://paybeehive.readme.io/reference/introducao)
- [n8n Community Nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Community Forum](https://community.n8n.io/)

---

## License

[MIT](LICENSE.md)
