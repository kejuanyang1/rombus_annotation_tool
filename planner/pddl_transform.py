import re
from pathlib import Path
from typing import Dict, List, Tuple, Iterable, Optional, Set
from collections import defaultdict

from test_load_scenes import objects

from unified_planning.io import PDDLReader
reader = PDDLReader()


id2name = {obj["id"]: obj["name"] for obj in objects}
name2id = {obj["name"]: obj["id"] for obj in objects}

LID_MAP: Dict[str, str] = {
    'container_07': 'lid_01',
    'container_08': 'lid_02',
    'container_09': 'lid_03',
    'container_10': 'lid_04',
}

def load_pddl_up(problem_filename):
    domain_filename = "pddl/manip_domain.pddl" # path of the PDDL domain file
    return reader.parse_problem(domain_filename, problem_filename)


def replace_pddl_ids(
    pddl_path: str | Path,
    id2name: Dict[str, str],
    output_path: Optional[str | Path] = None,
) -> str:
    """
    Replace object IDs with human‑readable names in a PDDL problem file.

    Parameters
    ----------
    pddl_path : str | Path
        Path to the original PDDL file.
    id2name : Dict[str, str]
        Mapping from object_id (e.g. 'kitchen_17') to object_name
        (e.g. 'red chili pepper').
    output_path : str | Path, optional
        If given, write the modified PDDL text to this file.

    Returns
    -------
    str
        The modified PDDL text with IDs replaced by names.
    """
    text = Path(pddl_path).read_text(encoding="utf‑8")

    for obj_id, obj_name in id2name.items():
        pattern = rf"\b({re.escape(obj_id)})(_\d+)?\b" 
        text = re.sub(pattern, lambda m: obj_name + (m.group(2) or ""), text)

    if output_path is not None:
        Path(output_path).write_text(text, encoding="utf‑8")

    return text


def replace_pddl_names(
    pddl_path: str | Path,
    name2id: Dict[str, str],
    output_path: Optional[str | Path] = None,
) -> str:
    """
    Replace human‑readable object names with object IDs in a PDDL problem file.

    Parameters
    ----------
    pddl_path : str | Path
        Path to the PDDL file whose names you want to convert back to IDs.
    name2id : Dict[str, str]
        Mapping from object_name (e.g. 'red chili pepper') to object_id
        (e.g. 'kitchen_17').
    output_path : str | Path, optional
        If given, write the modified PDDL text to this file.

    Returns
    -------
    str
        The PDDL text with names replaced by IDs.
    """
    text = Path(pddl_path).read_text(encoding="utf‑8")

    for obj_name, obj_id in sorted(name2id.items(), key=lambda x: -len(x[0])):
        pattern = rf"\b({re.escape(obj_name)})(_\d+)?\b"
        text = re.sub(pattern, lambda m: obj_id + (m.group(2) or ""), text)

    if output_path is not None:
        Path(output_path).write_text(text, encoding="utf‑8")

    return text


class PDDLProblem:
    """Lightweight representation of one PDDL *problem* file.

    Parsed information is accessible via:
    - ``domain``  : domain name declared in the problem
    - ``objects`` : ``{object_id: type}``
    - ``init``    : list of ground facts, each as ``(predicate, arg1, …)``
    - ``goal``    : list of goal facts, each as ``(predicate, arg1, …)``

    Two extra helpers are provided:
    - :py:meth:`ensure_defaults` — auto‑fill implied predicates such as
      ``ontable``, ``clear`` and ``handempty``.
    - :py:meth:`verify` — validate the *current* state against a set of
      task‑specific constraints and return a list of violation messages.
    """

    _COMMENT_RE = re.compile(r";.*$", re.M)
    _FACT_RE = re.compile(r"\([^\(\)]+\)")

    # --------------------------------------------------------------- #
    #                             Parsing                            #
    # --------------------------------------------------------------- #
    def __init__(self, domain: str, objects: Dict[str, str], init: List[Tuple[str, ...]], goal: List[Tuple[str, ...]]):
        self.domain = domain
        self.objects = objects  # {object_id: type}
        self.init = init        # [(predicate, *args)]
        self.goal = goal        # [(predicate, *args)]

    # -- factory helpers -- #
    @classmethod
    def from_file(cls, path: str | Path) -> "PDDLProblem":
        return cls.from_string(Path(path).read_text(encoding="utf-8"))

    @classmethod
    def from_string(cls, text: str) -> "PDDLProblem":
        text = cls._COMMENT_RE.sub("", text)  # strip PDDL comments
        domain = cls._parse_domain(text)
        objects = cls._parse_objects(text)
        init = cls._parse_init(text)
        goal = cls._parse_goal(text)
        return cls(domain, objects, init, goal)

    # -- internal parsers -- #
    @staticmethod
    def _parse_domain(text: str) -> str:
        m = re.search(r"\(:domain\s+([^\s\)]+)", text, re.I)
        if not m:
            raise ValueError("Domain name not found")
        return m.group(1)

    @classmethod
    def _parse_objects(cls, text: str) -> Dict[str, str]:
        m = re.search(r"\(:objects\s+(.*?)\)\s*(?::|$)", text, re.S | re.I)
        if not m:
            raise ValueError("Objects block not found")
        obj_block = m.group(1)
        objects: Dict[str, str] = {}
        for line in obj_block.strip().splitlines():
            line = line.strip()
            if not line or '-' not in line:
                continue
            names, typ = line.split('-', 1)
            typ = typ.strip()
            if typ == 'support':
                typ = 'item'
            for obj_id in names.split():
                objects[obj_id] = typ
        return objects

    @classmethod
    def _balance(cls, text: str, start: int) -> int:
        depth = 0
        for i in range(start, len(text)):
            if text[i] == '(':
                depth += 1
            elif text[i] == ')':
                depth -= 1
                if depth == 0:
                    return i
        raise ValueError("Unbalanced parentheses")

    @classmethod
    def _parse_init(cls, text: str) -> List[Tuple[str, ...]]:
        pos = text.lower().find('(:init')
        if pos == -1:
            raise ValueError("Init block not found")
        start = text.find('(', pos)  # first '(' of '(:init'
        end = cls._balance(text, start)
        block = text[start:end + 1]
        facts: List[Tuple[str, ...]] = []
        for f in cls._FACT_RE.findall(block):
            tokens = f.strip('()').split()
            if tokens and tokens[0].lower() != ':init':
                facts.append(tuple(tokens))
        return facts

    @classmethod
    def _parse_goal(cls, text: str) -> List[Tuple[str, ...]]:
        pos = text.lower().find('(:goal')
        if pos == -1:
            return []
        start = text.find('(', pos)
        end = cls._balance(text, start)
        block = text[start:end + 1]
        facts: List[Tuple[str, ...]] = []
        for f in cls._FACT_RE.findall(block):
            tokens = f.strip('()').split()
            if tokens and tokens[0].lower() not in (':goal', 'and'):
                facts.append(tuple(tokens))
        return facts

    # --------------------------------------------------------------- #
    #                             Helpers                             #
    # --------------------------------------------------------------- #
    def _index_facts(self):
        ons, ins, clears, ontable, closed = [], [], set(), set(), set()
        for fact in self.init:
            pred = fact[0]
            if pred == 'on' and len(fact) == 3:
                ons.append(fact[1:])          # (obj, support)
            elif pred == 'in' and len(fact) == 3:
                ins.append(fact[1:])          # (obj, container)
            elif pred == 'clear' and len(fact) == 2:
                clears.add(fact[1])
            elif pred == 'ontable' and len(fact) == 2:
                ontable.add(fact[1])
            elif pred == 'closed' and len(fact) == 2:
                closed.add(fact[1])
        return ons, ins, clears, ontable, closed

    # --------------------------------------------------------------- #
    #                     Default‑predicate handling                  #
    # --------------------------------------------------------------- #
    def ensure_defaults(self) -> None:
        """Insert implied predicates if they are currently missing.

        * If an object is **neither** ``in`` a container **nor** ``on`` another
          support object, add ``(ontable obj)``.
        * If **no** object is on top of *obj*, ensure ``(clear obj)``.
        * Ensure ``(handempty)`` exists exactly once.
        """
        ons, ins, clears, ontable, closed = self._index_facts()
        on_top: Set[str] = {o for o, _ in ons}
        supports: Set[str] = {s for _, s in ons}
        in_objs: Set[str] = {o for o, _ in ins}
        # -- ontable -- #
        for obj in self.objects:
            if obj not in on_top and obj not in in_objs and (obj not in ontable):
                self.init.append(('ontable', obj))
                
        # -- clear -- #
        for obj, typ in self.objects.items():
            if typ == 'container':
                # ensure containers have *no* clear fact
                if obj in clears:
                    self.init = [f for f in self.init if not (f[0] == 'clear' and f[1] == obj)]
                    clears.discard(obj)
                continue
            if obj not in supports and obj not in clears:
                self.init.append(('clear', obj))
                clears.add(obj)
                
        # -- handempty -- #
        if not any(f[0] == 'handempty' for f in self.init):
            self.init.append(('handempty',))

        # -- lid on closed bowl -- #
        for bowl in closed:
            mapped_lid = LID_MAP.get(bowl)
            if not mapped_lid or mapped_lid not in self.objects:
                continue
            # remove any ontable fact for the lid first
            if mapped_lid in ontable:
                self.init = [f for f in self.init if not (f[0] == 'ontable' and f[1] == mapped_lid)]
                ontable.discard(mapped_lid)
            # check if lid already on bowl
            has_lid = any(obj == mapped_lid and sup == bowl for obj, sup in ons)
            if not has_lid:
                self.init.append(('on', mapped_lid, bowl))
                ons.append((mapped_lid, bowl))
                supports.add(bowl)
                on_top.add(mapped_lid)
            # bowl should not have clear, lid should have clear
            self.init = [f for f in self.init if not (f[0] == 'clear' and f[1] == bowl)]
            clears.discard(bowl)
            if mapped_lid not in clears:
                self.init.append(('clear', mapped_lid))
                clears.add(mapped_lid)

    # --------------------------------------------------------------- #
    #                            Validation                           #
    # --------------------------------------------------------------- #
    def verify(self) -> List[str]:
        """Check whether current ``init`` satisfies domain‑specific constraints.
        """
        ons, ins, clears, ontable, closed = self._index_facts()

        # ---- 1. constraints for ON ---- #
        for obj, support in ons:
            typ = self.objects.get(support, None)
            if typ not in ['item', 'container']:
                raise ValueError(f"Invalid support '{support}' of type '{typ}' for ON predicate.")
        # ---- 2. CLOSED only for bowls and must have lid on it ---- #
        for bowl in closed:
            if bowl not in LID_MAP.keys():
                raise ValueError(f"Only bowls may be closed, but '{bowl}' is type '{self.objects.get(bowl)}'.")
            has_lid = any(sup == bowl and LID_MAP[bowl] == lid for lid, sup in ons)
            if not has_lid:
                raise ValueError(f"Closed object '{bowl}' has no lid ON it.")
        # ---- 3. IN predicate container type ---- #
        for obj, container in ins:
            if self.objects.get(container) != 'container':
                raise ValueError(f"IN target '{container}' must be a container, got '{self.objects.get(container)}'.")
        # ---- 4. default predicates presence ---- #
        container_objs = {o for o, t in self.objects.items() if t == 'container'}
        for obj in self.objects:
            if obj not in {o for o, _ in ins} and obj not in {o for o, _ in ons} and obj not in ontable:
                raise ValueError(f"Missing ONTABLE for '{obj}'.")
            # CLEAR rules
            if obj in container_objs:
                if obj in clears:
                    raise ValueError(f"Container '{obj}' should **not** have CLEAR predicate.")
            else:
                if obj not in {s for _, s in ons} and obj not in clears:
                    raise ValueError(f"Missing CLEAR for '{obj}'.")
        if not any(f[0] == 'handempty' for f in self.init):
            raise ValueError("Missing HANDENPTY predicate.")
        

    # --------------------------------------------------------------- #
    #                          Serialization                          #
    # --------------------------------------------------------------- #
    def to_pddl(self) -> str:
        by_type: Dict[str, List[str]] = defaultdict(list)
        for obj_id, typ in self.objects.items():
            by_type[typ].append(obj_id)
        obj_block = "\n".join(
            f"    {' '.join(sorted(ids))} - {typ}" for typ, ids in sorted(by_type.items())
        )
        init_block = "\n".join("    (" + " ".join(f) + ")" for f in sorted(self.init))
        goal_block = "\n".join("    (" + " ".join(g) + ")" for g in sorted(self.goal))
        if goal_block:
            goal_block = "\n" + goal_block + "\n  "
        return (
            "(define (problem generated)\n"
            f"  (:domain {self.domain})\n"
            "  (:objects\n" + obj_block + "\n  )\n"
            "  (:init\n" + init_block + "\n  )\n"
            "  (:goal (and" + goal_block + "))\n)\n"
        )

    # --------------------------------------------------------------- #
    #                  I/O & identifier replacement                   #
    # --------------------------------------------------------------- #
    def save(self, path: str | Path) -> None:
        Path(path).write_text(self.to_pddl(), encoding="utf-8")

    def replace_ids(self, mapping: Dict[str, str], *, reverse: bool = False) -> None:
        repl = mapping if not reverse else {v: k for k, v in mapping.items()}
        self.objects = {repl.get(o, o): t for o, t in self.objects.items()}
        new_init: List[Tuple[str, ...]] = []
        for fact in self.init:
            pred, *args = fact
            new_args = [repl.get(a, a) for a in args]
            new_init.append((pred, *new_args))
        self.init = new_init
        new_goal: List[Tuple[str, ...]] = []
        for fact in self.goal:
            pred, *args = fact
            new_args = [repl.get(a, a) for a in args]
            new_goal.append((pred, *new_args))
        self.goal = new_goal



def revert_pddl(task_range):
    selected_set = [f'{scene:02d}_{x}' for scene in range(task_range[0], task_range[1]) for x in range(3)]
    for task_id in selected_set:
        # new_pddl = replace_pddl_ids(f"instances/init_state/{task_id}.pddl", id2name, f"instances/init_state_name/{task_id}.pddl")
        reverted_pddl = replace_pddl_names(
            f"pddl/init_state_name/{task_id}.pddl",
            name2id,
            f"pddl/init_state_id/{task_id}.pddl",
        )
        print(reverted_pddl)

def verify_pddl(task_range, input_path='pddl/init_state_id', output_path='pddl/init_state_id_verified'):
    selected_set = [f'{scene:02d}_{x}' for scene in range(task_range[0], task_range[1]) for x in range(3)]
    for task_id in selected_set:
        prob = PDDLProblem.from_file(f"{input_path}/{task_id}.pddl")
        prob.ensure_defaults()
        print(task_id)
        print(prob.init)
        try:
            prob.verify()
        except ValueError as e:
            print(task_id)
            print(e)
            exit()
        save_path = f"{output_path}/{task_id}.pddl"
        prob.save(save_path)
        load_pddl_up(save_path) # verify via loading in up


def merge_goal_pddl(task_range, input_path='pddl/init_state_id_verified', input_target_path='pddl/goal_state_id_verified', output_path='pddl/goal_state_id_merged'):
    selected_set = [f'{scene:02d}_{x}' for scene in range(task_range[0], task_range[1]) for x in range(3)]
    for task_id in selected_set:
        prob = PDDLProblem.from_file(f"{input_path}/{task_id}.pddl")
        prob_target = PDDLProblem.from_file(f"{input_target_path}/{task_id}.pddl")
        prob.goal = prob_target.init.copy()
        print(task_id)
        print(prob.init)
        print(prob.goal)
        try:
            prob.verify()
        except ValueError as e:
            print(task_id)
            print(e)
            exit()
        save_path = f"{output_path}/{task_id}.pddl"
        prob.save(save_path)
        load_pddl_up(save_path) # verify via loading in up        
            

if __name__ == "__main__":
    task_range = (46, 81)
    #revert_pddl(task_range)
    #verify_pddl(task_range, input_path='app/bbox-manipulator-backend/pddl', output_path='pddl/goal_state_id_verified')
    merge_goal_pddl(task_range)
    
    # prob = PDDLProblem.from_file("instances/init_state_id/01_0.pddl")
    # print(prob.domain)
    # print(prob.objects)
    # print(prob.init)

    # prob.ensure_defaults()
    # print(prob.init)
    # prob.verify()
    # prob.save("/Users/ykj/Desktop/github/ROMBUS/planner/test/01_0.pddl")