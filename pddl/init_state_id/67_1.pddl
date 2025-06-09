(define (problem scene)
  (:domain manip)
  (:objects
    office_01 - item
    office_04 - item
    office_06 - item
    office_07 - item
    office_08 - item
    tool_08 - item
    container_01 - container
    container_02 - container
  )
  (:init
    (ontable office_08)
    (ontable tool_08)
    (ontable office_04)
    (in office_01 container_01)
    (in office_06 container_01)
    (in office_07 container_02)
    (handempty)
    (clear office_08)
    (clear tool_08)
    (clear office_04)
  )
  (:goal (and))
)