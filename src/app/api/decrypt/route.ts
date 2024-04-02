import crypto from 'crypto';

const charMapping = {
	/**
	 * Creates a builder for building a character map.
	 * @returns {module:utils/charMapping~CharacterMapBuilder} A character map builder.
	 */
	createBuilder: () => {
		const map = {} as { [key: string]: number };
		return {
			map,

			/**
			 * Adds a range mapping to the map.
			 * @param {string} start Start character.
			 * @param {string} end End character.
			 * @param {numeric} base Value corresponding to the start character.
			 * @memberof module:utils/charMapping~CharacterMapBuilder
			 * @instance
			 */
			addRange: (start: string, end: string, base: number) => {
				const startCode = start.charCodeAt(0);
				const endCode = end.charCodeAt(0);

				for (let code = startCode; code <= endCode; ++code)
					map[String.fromCharCode(code)] = code - startCode + base;
			}
		};
	}
};

const CHAR_TO_NIBBLE_MAP = (() => {
	const builder = charMapping.createBuilder();
	builder.addRange('0', '9', 0);
	builder.addRange('a', 'f', 10);
	builder.addRange('A', 'F', 10);
	return builder.map;
})();

const tryParseByte = (char1: string, char2: string) => {
	const nibble1 = CHAR_TO_NIBBLE_MAP[char1];
	const nibble2 = CHAR_TO_NIBBLE_MAP[char2];
	return undefined === nibble1 || undefined === nibble2
		? undefined
		: (nibble1 << 4) | nibble2;
};

const toByte = (char1: string, char2: string) => {
	const byte = tryParseByte(char1, char2);
	if (undefined === byte)
		throw Error(`unrecognized hex char '${char1}${char2}'`);

	return byte;
};
const hexToUint8 = (input: string) => {
	if (0 !== input.length % 2)
		throw Error(`hex string has unexpected size '${input.length}'`);

	const output = new Uint8Array(input.length / 2);
	for (let i = 0; i < input.length; i += 2)
		output[i / 2] = toByte(input[i], input[i + 1]);

	return output;
};

const algorithm = 'aes-256-cbc';
function decrypt(keyStr: string, ivStr: string, encryptedDataStr: string) {
  const key = Buffer.from(keyStr, 'hex');
  const iv = Uint8Array.from(Buffer.from(ivStr, 'hex'));
  const encryptedData = Buffer.from(encryptedDataStr, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  const decryptedJsonStr = new TextDecoder().decode(decryptedData);
  return decryptedJsonStr;
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const transactionHash = searchParams.get('transactionHash');
  const keyStr = searchParams.get('keyStr');
  const ivStr = searchParams.get('ivStr');
  if (!transactionHash || !keyStr || !ivStr) {
    return Response.json({ message: 'not enough params' }, { status: 400 });
  }

  const trData = await (await fetch(`${process.env.SYMBOL_NODE}/transactions/confirmed/${transactionHash}`)).json();
  const message = new TextDecoder().decode(hexToUint8(
    trData.transaction.transactions.map((x: any) => x.transaction.message.substring(2)).join('')
  ));
  const jsonStr = decrypt(keyStr, ivStr, message);

  const sleepData = JSON.parse(jsonStr)
  return Response.json(sleepData)
}
