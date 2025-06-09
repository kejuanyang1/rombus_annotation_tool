(define (problem scene1)
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
    (ontable office_07)
    (ontable office_06)
    (ontable office_04)
    (ontable office_01)
    (in tool_08 container_02)
    (in office_08 container_01)
    (handempty)
    (clear office_07)
    (clear office_06)
    (clear office_04)
    (clear office_01)
  )
  (:goal (and ))
)